import React, { Component } from 'react';
import { Menu, Divider, Form } from 'semantic-ui-react';

class Categories extends Component {
    constructor(props) {
        super(props);
        this.state = {
            newCategory: ''
        };
    }

    handleChange = (e, { value }) => {
        this.setState({ newCategory: value });
    }

    handleSubmit = () => {
        const { newCategory } = this.state;
        if (newCategory.trim()) {
            this.props.handleSubmit(newCategory);
            this.setState({ newCategory: '' }); // Clear the input after submission
        }
    }

    render() {
        return (
            <Menu text vertical>
                <Menu.Item header>Categories:</Menu.Item>
                <Divider />
                {this.props.categories.map((category) => (
                    <Menu.Item key={category.name} onClick={() => this.props.assignCategory(category.name)}>
                        {category.name}
                    </Menu.Item>
                ))}
                <Divider />
                <Form onSubmit={this.handleSubmit}>
                    <Form.Group>
                        <Form.Input
                            placeholder='Add category'
                            name='newCategory'
                            value={this.state.newCategory}
                            onChange={this.handleChange}
                        />
                        <Form.Button icon='add' size='small'/>
                    </Form.Group>
                </Form>
            </Menu>
        );
    }
}

export default Categories;