import React from 'react';



export default class Locations extends React.Component {
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


        const routeChange = () => {
            let path = `newPath`;
            this.history.push(path);
        }


        const LocationMenu = {
            width: "80%",
            display: "grid",
            margin: "100px auto",
            // backgroundColor: "red",
            gridTemplateColumns: "1fr 1fr 1fr"
        }

        return (
            <>
                <nav style={LocationMenu}>
                    <NavButton onClick={routeChange} name="Fab lab"></NavButton>
                    <NavButton name="Fab Lab 2"></NavButton>
                    <NavButton name="Fab Lab 3"></NavButton>
                </nav>
            </>
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
        const card = {
            background: "#222",
            color: "#fff",
            cursor: "pointer",
            width: "400px",
            height: "300px",
            placeSelf: "center",
            borderRadius: "10px",
            overflow: "hidden"
        }

        const imageStyle = {
            width: "100%"
        }

        const caption = {
            padding: "10px"
        }

        if (this.state.hover) {
            card.backgroundColor = '#666'
        } else {
            card.backgroundColor = '#333'
        }




        const routeChange = () => {
            console.log("HRERE")
            let path = `newPath`;
            this.props.history.push(path);
        }


        return (
            <div style={card} onClick={routeChange} onMouseEnter={this.toggleHover} onMouseLeave={this.toggleHover} >
                <img style={imageStyle} src="https://cdn.mos.cms.futurecdn.net/JN4id4eQ79r4c4JzHVNtH5.jpg" />
                <p style={caption}>
                    {this.props.name}
                </p>
            </div>
        )
    }
}