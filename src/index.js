import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Route} from 'react-router';
import {Router, Switch} from 'react-router-dom';

import teams from './teams';
import members from './members';
import {Button} from "react-bootstrap";
import history from './history'

class MainContainer extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isTeamPage: true,
        };
        this.buttonListChangeClick = this.buttonListChangeClick.bind(this);
    }

    buttonListChangeClick = () => {
        if (this.state.isTeamPage) {
            history.replace("/members");
        } else {
            history.replace("/teams");
        }
        this.setState({
            isTeamPage: !this.state.isTeamPage
        })
    }

    render() {

        return (
            <div className="container marketing team-container">
                <section className="jumbotron text-center">
                    <div className="container">
                        <h1 className="jumbotron-heading">FrontEnd Test Demo</h1>
                        <p>
                            <Button
                                className={"btn" + this.state.isTeamPage ? 'btn-primary' : 'btn-secondary' + "my"}
                                onClick={this.buttonListChangeClick}>{this.state.isTeamPage ? "Teams" : "Members"}</Button>
                        </p>
                    </div>
                </section>
                <Router history={history}>
                    <Switch>
                        <Route path="/members" exact component={members}/>
                        <Route path="*" component={teams}/>
                    </Switch>
                </Router>
            </div>

        );
    }

}

ReactDOM.render(
    <MainContainer/>,

    document.getElementById('root')
);