import React from 'react';


export default class Nav extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hover: false,
        };
    }

    toggleHover = () => {
        console.log(this.state.hover)
        this.setState({ hover: !this.state.hover })
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
                <NavButton name="About"></NavButton>
                <NavButton name="Locations"></NavButton>
                <NavButton name="Contact"></NavButton>
                <NavButton name="Privacy"></NavButton>
            </nav>
        )
    }
}

class NavButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hover: false,
        };
    }

    toggleHover = () => {
        this.setState({ hover: !this.state.hover })
    }

    render() {
        const navButton = {
            background: "#222",
            color: "#fff",
            padding: "8px 25px",
            marginLeft: "20px",
            marginTop: "5px",
            alignSelf: "center",
            cursor: "pointer"
        }

        if (this.state.hover) {
            navButton.backgroundColor = '#666'
        } else {
            navButton.backgroundColor = '#333'

        }


        return (
            <div style={navButton} onMouseEnter={this.toggleHover} onMouseLeave={this.toggleHover} >{this.props.name}</div>
        )
    }
}