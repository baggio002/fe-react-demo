import React from 'react';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Row, Grid, Button, Modal} from 'react-bootstrap';
import {fetchMember, fetchTeam, fetchList} from './data-utils'

export default class Members extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            showModal: false,
            teams: [],
            members: [],
            member: {}
        };
        this.showModalForDetails = this.showModalForDetails.bind(this);
        this.dissmissModalForDetails = this.dissmissModalForDetails.bind(this);
    }

    showModalForDetails(ev, member) {
        this.setState({
            showModal: true,
            member: member,
            teams: []
        }, () => {
            let arr = [];
            if (member.member_teams != null) {
                member.member_teams.map(
                    (id) => {
                        fetchTeam(id, (team, status) => {
                            arr.push(team);
                            this.setState({teams: arr});
                        })
                    }
                )
            }

        });

    }

    dissmissModalForDetails() {
        this.setState({
            showModal: false,
            teams: []
        });
    }

    componentDidMount() {
        fetchList(false, (members, status) => {
            if (status.isLoaded && status.error == null) {
                let arr = [];
                members.map(
                    (member) => {
                        fetchMember(member.id, (member, status) => {
                            if (status.error != null) {
                                return;
                            }
                            arr.push(member);
                            this.setState({
                                members: arr
                            });
                        })
                    }
                );
            }
            this.setState(
                {
                    isLoaded: status.isLoaded,
                    error: status.error
                }
            );
        })
    }

    render() {
        const {error, isLoaded} = this.state;
        console.log("members == ");
        if (error) {
            return <div>Error: {error.message}</div>;
        } else if (!isLoaded) {
            return <div>Loading...</div>;
        } else {
            return (
                <Grid className="container marketing">
                    <DetailsModal showModal={this.state.showModal} dissmissModal={this.dissmissModalForDetails}
                                  details={this.state.member} teams={this.state.teams} />
                    <Row>
                        {
                            this.state.members.map((member) => (
                                <div className="col-lg-4" key={member.id}>
                                    <img className="rounded-circle"
                                         src="data:image/gif;base64,R0lGODlhAQABAIAAAHd3dwAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw=="
                                         alt="Team Image" width="140" height="140"/>
                                    <h4>{member.username}</h4>
                                    <p>{member.name}</p>
                                    <p><Button className="btn btn-secondary" onClick={(ev) => {
                                        this.showModalForDetails(ev, member)
                                    }}>Show Details »</Button></p>
                                </div>
                            ))}
                    </Row>
                </Grid>);
        }

    }

}

class DetailsModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {

        return (
            <div className={this.props.showModal ? 'display-block' : 'display-none'}>
                <Modal.Dialog>
                    <Modal.Header>
                        <Modal.Title>{this.props.details.username}</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <ul>
                            <li><h4>{this.props.details.name}</h4></li>
                            <h6>Teams:</h6>
                            {
                                this.props.teams.map(
                                    (team) => (
                                        <p>{team.name}</p>
                                    )
                                )
                            }
                        </ul>
                    </Modal.Body>

                    <Modal.Footer>
                        <Button bsStyle="primary" onClick={this.props.dissmissModal}>OK</Button>
                    </Modal.Footer>
                </Modal.Dialog>
            </div>
        );
    }
}

