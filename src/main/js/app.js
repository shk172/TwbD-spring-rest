const React = require('react');
const ReactDOM = require('react-dom');
const client = require('./client');

class App extends React.Component {

	constructor(props) {
		super(props);
		this.state = {players: []};
	}

	componentDidMount() {
		client({method: 'GET', path: '/api/players'}).done(response => {
			this.setState({players: response.entity._embedded.players});
			console.log(response);
			console.log(this.state.players);
		});
	}

	render() {
		return (
			<PlayerList players={this.state.players}/>
		)
	}
}

class PlayerList extends React.Component{
	render() {
		var players = this.props.players.map(player =>
			<Player key={player._links.self.href} player={player}/>
		);
		return (
			<div>
				There Will Be Dragons
				<table>
					<tbody>
						<tr>
							<th>UserName</th>
							<th>Nickname</th>
						</tr>
						{players}
					</tbody>
				</table>
			</div>
		)
	}
}

class Player extends React.Component{
	render() {
		return (
			<tr>
				<td>{this.props.player.userName}</td>
				<td>{this.props.player.nickname}</td>
			</tr>
		)
	}
}

ReactDOM.render(
	<App />,
	document.getElementById('react')
)