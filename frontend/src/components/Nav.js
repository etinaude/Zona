import React from 'react';
import './Nav.css';

export default class Nav extends React.Component {
    tabs = ["About", "Locations", "Contact", "Privacy"]
    activeTab = "About"

    constructor(props) {
        super(props);
        this.state = {
            buttons: this.changeButton()
        };
    }


    switchTab = (tab) => {
        this.props.changeTab(tab)

        this.activeTab = tab
        this.setState({
            buttons: this.changeButton(),
        });
    }

    changeButton() {
        var buttons = this.tabs.map((item, index) => {
            return <NavButton key={index} name={item} onActivate={this.switchTab} active={item === this.activeTab}></NavButton>
        })
        return buttons
    }


    render() {
        const navMenu = {
            width: "100%",
            height: "70px",
            position: "fixed",
            top: -2,
            left: -2,
            background: "#222",
            display: "flex",
        }



        return (
            <nav style={navMenu}>
                {this.state.buttons}
            </nav>
        )
    }
}

class NavButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            active: this.props.active,
        };
    }

    toggleHover = () => {
        this.setState({ hover: !this.state.hover })
    }

    navigate = () => {
        this.props.onActivate(this.props.name)
    }

    render() {


        return (
            <div className={"navButton " + this.props.active} onClick={this.navigate} onMouseEnter={this.toggleHover} onMouseLeave={this.toggleHover} >{this.props.name}</div>
        )
    }
}