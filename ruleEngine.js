class Node {
    constructor(type, left = null, right = null, value = null) {
        this.type = type; // "operator" or "operand"
        this.left = left; // Left child (for operators)
        this.right = right; // Right child (for operators)
        this.value = value; // Value for operand nodes (e.g., comparisons)
    }
}

class RuleEngine {
    constructor() {
        this.rules = [];
    }

    create_rule(rule_string) {
        try {
            const ast = this.parseRule(rule_string);
            this.rules.push(ast);
            this.renderRules();
            this.visualizeAST(ast); // Visualize AST after creation
            document.getElementById('ruleInput').value = ''; // Clear input for better UX
            return ast;
        } catch (error) {
            alert('Error creating rule: ' + error.message);
        }
    }

    parseRule(ruleString) {
        const trimmedRule = ruleString.replace(/\s+/g, '');
        const operandPattern = /([a-z]+)([><=]+)(\d+|'[a-zA-Z]+')/g;
        const operatorPattern = /(AND|OR)/g;

        let parts = trimmedRule.split(operatorPattern);
        let operatorStack = [];
        let nodeStack = [];

        for (let part of parts) {
            if (operatorPattern.test(part)) {
                operatorStack.push(part);
            } else {
                const matches = Array.from(part.matchAll(operandPattern));
                let subExpression = this.buildOperandAST(matches);
                nodeStack.push(subExpression);
            }

            while (operatorStack.length > 0 && nodeStack.length > 1) {
                const right = nodeStack.pop();
                const left = nodeStack.pop();
                const operator = operatorStack.pop();
                const operatorNode = new Node("operator", left, right, operator);
                nodeStack.push(operatorNode);
            }
        }

        return nodeStack[0]; // Return the root of the AST
    }

    buildOperandAST(matches) {
        if (matches.length === 0) return null;
        const match = matches[0];
        const node = new Node("operand", null, null, {
            attribute: match[1],
            operator: match[2],
            value: match[3]
        });
        return node;
    }

    combine_rules(rules) {
        const combinedNode = new Node("operator", null, null, "OR");
        let left = null;

        for (const rule of rules) {
            const ruleAST = this.parseRule(rule);
            if (!left) {
                left = ruleAST;
            } else {
                combinedNode.left = left;
                combinedNode.right = ruleAST;
                left = combinedNode;
                combinedNode = new Node("operator", null, null, "OR");
            }
        }

        return left || combinedNode; // Return combined AST
    }

    evaluate_rule(ast, data) {
        if (!ast) return false;

        if (ast.type === "operand") {
            return this.evaluateOperand(ast.value, data);
        } else if (ast.type === "operator") {
            const leftEval = this.evaluate_rule(ast.left, data);
            const rightEval = this.evaluate_rule(ast.right, data);
            return ast.value === "AND" ? leftEval && rightEval : leftEval || rightEval; // Combine with OR
        }
        return false;
    }

    evaluateOperand({ attribute, operator, value }, data) {
        const dataValue = typeof data[attribute] === 'string' ? data[attribute].replace(/'/g, '') : data[attribute];
        const compValue = typeof value === 'string' ? value.replace(/'/g, '') : Number(value);

        switch (operator) {
            case '>':
                return dataValue > compValue;
            case '<':
                return dataValue < compValue;
            case '=':
                return dataValue === compValue;
            case '>=':
                return dataValue >= compValue;
            case '<=':
                return dataValue <= compValue;
            default:
                return false;
        }
    }

    renderRules() {
        const rulesList = document.getElementById('rulesList');
        rulesList.innerHTML = ''; // Clear previous rules
        this.rules.forEach((rule, index) => {
            const ruleDiv = document.createElement('div');
            ruleDiv.textContent = 'Rule ' + (index + 1) + ': ' + this.ruleToString(rule);
            rulesList.appendChild(ruleDiv);
        });
    }

    ruleToString(node) {
        if (!node) return '';
        if (node.type === 'operand') {
            const { attribute, operator, value } = node.value;
            return `(${attribute} ${operator} ${value})`;
        } else if (node.type === 'operator') {
            const leftString = this.ruleToString(node.left);
            const rightString = this.ruleToString(node.right);
            return `(${leftString} ${node.value} ${rightString})`;
        }
        return '';
    }

    visualizeAST(ast) {
        const margin = { top: 20, right: 120, bottom: 20, left: 120 };
        const width = 800 - margin.right - margin.left;
        const height = 400 - margin.top - margin.bottom;

        // Clear previous visualization
        d3.select("#ast").select("svg").remove();

        const svg = d3.select("#ast")
            .append("svg")
            .attr("width", width + margin.right + margin.left)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        const treeData = this.buildTreeData(ast);

        const treeLayout = d3.tree().size([height, width]);
        const root = d3.hierarchy(treeData);
        treeLayout(root);

        // Draw links
        svg.selectAll(".link")
            .data(root.links())
            .enter()
            .append("line")
            .attr("class", "link")
            .attr("x1", d => d.source.y)
            .attr("y1", d => d.source.x)
            .attr("x2", d => d.target.y)
            .attr("y2", d => d.target.x);

        // Draw nodes
        const nodes = svg.selectAll(".node")
            .data(root.descendants())
            .enter()
            .append("g")
            .attr("class", "node")
            .attr("transform", d => `translate(${d.y},${d.x})`);

        nodes.append("circle")
            .attr("r", 10)
            .attr("class", "node");

        nodes.append("text")
            .attr("dy", ".35em")
            .attr("x", d => d.children ? -12 : 12)
            .style("text-anchor", d => d.children ? "end" : "start")
            .text(d => d.data.name);
    }

    buildTreeData(node) {
        if (!node) return null;
        if (node.type === 'operand') {
            return { name: `${node.value.attribute} ${node.value.operator} ${node.value.value}` };
        } else if (node.type === 'operator') {
            return {
                name: node.value,
                children: [this.buildTreeData(node.left), this.buildTreeData(node.right)]
            };
        }
        return null;
    }
}

const ruleEngine = new RuleEngine();

document.getElementById('createRuleBtn').addEventListener('click', () => {
    const ruleInput = document.getElementById('ruleInput').value;
    ruleEngine.create_rule(ruleInput);
});

document.getElementById('combineRulesBtn').addEventListener('click', () => {
    const combinedAST = ruleEngine.combine_rules(ruleEngine.rules.map(rule => ruleEngine.ruleToString(rule)));
    document.getElementById('combinedRules').textContent = ruleEngine.ruleToString(combinedAST);
    ruleEngine.visualizeAST(combinedAST); // Visualize the combined AST
});

document.getElementById('evaluateRuleBtn').addEventListener('click', () => {
    const jsonInput = document.getElementById('jsonInput').value;
    const data = JSON.parse(jsonInput);
    const result = ruleEngine.evaluate_rule(ruleEngine.rules[ruleEngine.rules.length - 1], data);
    document.getElementById('result').textContent = result ? 'True' : 'False';
});
