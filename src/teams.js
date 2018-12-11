import React from 'react';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Row, Grid, Button, Modal} from 'react-bootstrap';
import {fetchMember, fetchTeam, fetchList} from './data-utils'

export default class Teams extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            showModal: false,
            teams: [],
            members: [],
            team: {},
            leader: {}
        };
        this.showModalForDetails = this.showModalForDetails.bind(this);
        this.dissmissModalForDetails = this.dissmissModalForDetails.bind(this);
    }

    showModalForDetails(ev, id) {
        this.setState({
            showModal: true,
            members: []
        });
        fetchTeam(id, (team, status) => {
            this.setState({
                team: team,
                isLoaded: status.isLoaded,
                error: status.error
            });
            let arr = [];
            fetchMember(team.lead, (member, status) => {
                this.setState({
                    leader: member
                });
            });
            team.members.map(
                (memberId) => {
                    fetchMember(memberId, (member, status) => {
                        arr.push(member);
                        this.setState({
                            members: arr
                        })
                    })
                }
            );
        });
    }

    dissmissModalForDetails() {
        this.setState({
            showModal: false,
            members: []
        });
    }

    componentDidMount() {
        fetchList(true, (teams, status) => {
            if (status.isLoaded && status.error == null) {
                let arr = [];
                teams.map(
                    (team) => {
                        fetchTeam(team.id, (team, status) => {
                            if (status.error != null) {
                                return;
                            }
                            fetchMember(team.lead, (leader, status) => {
                                if (status.error != null) {
                                    return;
                                }
                                team.lead = leader;
                                arr.push(team);
                                this.setState({
                                    teams: arr
                                });
                            })
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
        console.log("teams == ");

        if (error) {
            return <div>Error: {error.message}</div>;
        } else if (!isLoaded) {
            return <div>Loading...</div>;
        } else {
            return (
                <Grid className="container marketing">
                    <DetailsModal showModal={this.state.showModal} dissmissModal={this.dissmissModalForDetails}
                                  details={this.state.team} members={this.state.members} leader={this.state.leader}/>
                    <Row>
                        {
                            this.state.teams.map((team) => (
                                <div className="col-lg-4" key={team.id}>
                                    <img className="rounded-circle"
                                         src="data:image/gif;base64,R0lGODlhAQABAIAAAHd3dwAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw=="
                                         alt="Team Image" width="140" height="140"/>
                                    <h2>{team.name}</h2>
                                    <p>Leader: {team.lead.name}</p>
                                    <p><Button className="btn btn-secondary" onClick={(ev) => {
                                        this.showModalForDetails(ev, team.id)
                                    }}>Show Detail »</Button></p>
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
                        <Modal.Title>{this.props.details.name}</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <ul>
                            <li><h4>Leader: {this.props.leader.username} - {this.props.leader.name}</h4></li>
                            <h6>Members:</h6>
                            {this.props.members.map(
                                (member) => (
                                    <p key={member.id}>{member.username} - {member.name}</p>
                                )
                            )}
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

