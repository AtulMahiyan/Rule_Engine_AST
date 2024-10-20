# Rule Engine

## Overview

This Rule Engine project allows users to create, combine, and evaluate complex logical rules using attributes such as age, salary, department, and experience. It features dynamic rule creation, rule combination, and an evaluation system that checks user-defined JSON data against the created rules. Additionally, it provides a visualization of the Abstract Syntax Tree (AST) for better comprehension of rule structures.

## Table of Contents

1. Features

2. Tech Stack

3. Installation

4. Usage

5. Design Choices

6. Dependencies

7. License

## Features

1. **Rule Creation Module**: Users can define complex rules using logical operators (AND, OR) and conditions. Multiple rules can be created for different attributes.
   - Example rule:
     ```
     (age > 40 AND (salary < 50000 OR department = 'HR'))
     ```

2. **Rule Combination Module**: Once multiple rules are created, they can be manually combined using logical operators to form a more complex rule.
   - Example combined rule:
     ```
     (((age > 40 AND (salary < 50000 OR department = 'HR')) OR (experience >= 5 AND (salary >= 60000 AND salary <= 80000) AND (department = 'Sales' OR department = 'Marketing'))))
     ```

3. **Rule Evaluation Module**: Users can input JSON data to evaluate if the data satisfies the combined rule.
   - Example JSON input:
     ```json
     { "age": 35, "department": "Sales", "salary": 60000, "experience": 3 }
     ```
   - Result:
     ```
     Eligible
     ```

4. **AST Visualization**: The application visualizes the Abstract Syntax Tree (AST) for each rule and combined rule, allowing users to understand the structure of their logical expressions.

## Tech Stack

1. HTML

2. CSS

3. JavaScript

4. D3.js (for AST visualization)

## Installation

To set up the application, follow these steps:

1. open the repository:
   https://github.com/AtulMahiyan/Rule_Engine_AST

2. Open the `index.html` file in your web browser to run the application.

## Usage

1. **Create Rule**: Enter a rule in the input field using the syntax (e.g., `age > 30 AND department = 'Sales'`). Press the **Create Rule** button to save the rule.

2. **Combine Rules**: After creating at least two rules, click the **Combine Rules** button to merge them into a single logical expression.

3. **Evaluate Rule**: Input JSON data in the evaluation field and click **Evaluate** to check if the combined rule is satisfied by the data.

4. **Visualize AST**: The AST for each rule and combined rule will be visualized to provide a structural view of the logical expressions.

## Design Choices

1. Dynamic Rule Creation: Allows users to define and manage complex logical rules with flexible operators (AND, OR).

2. Rule Combination: Facilitates the merging of multiple rules into more complex logical expressions.

3. JSON Data Evaluation: User inputs are evaluated against created rules to check for eligibility.

4. AST Visualization: D3.js is used to visualize the Abstract Syntax Tree (AST), helping users understand the structure of their rules.

5. Simplicity: Focuses on a user-friendly interface and minimal dependencies for ease of use and maintenance.

## Dependencies

To run the project smoothly, ensure you have the following:

1. **D3.js**: A JavaScript library for producing dynamic, interactive data visualizations in web browsers (used for AST visualization).

2. No other dependencies are required apart from the basic web technologies (HTML, CSS, JavaScript).

## License

This project is not licensed.
