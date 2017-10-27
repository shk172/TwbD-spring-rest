const React = require('react');
const ReactDOM = require('react-dom');
const client = require('./client');
const when = require('when');
const follow = require('./follow');

const root = '/api';

class App extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			players: [], 
			attributes: [], 
			pageSize: 2, 
			links: {}};
		this.updatePageSize = this.updatePageSize.bind(this);
		this.onCreate = this.onCreate.bind(this);
		this.onUpdate = this.onUpdate.bind(this);
		this.onDelete = this.onDelete.bind(this);
		this.onNavigate = this.onNavigate.bind(this);
	}

	loadFromServer(pageSize) {
		follow(client, root, [
			{rel: 'players', params: {size: pageSize}}]
		).then(playerCollection => {
			return client({
				method: 'GET',
				path: playerCollection.entity._links.profile.href,
				headers: {'Accept': 'application/schema+json'}
			}).then(schema => {
				this.schema = schema.entity;
				this.links = playerCollection.entity._links;
				return playerCollection;
			});
		}).then(playerCollection => {
			console.log(playerCollection);
			return playerCollection.entity._embedded.players.map(player =>
					client({
						method: 'GET',
						path: player._links.self.href
					})
			);
		}).then(playerPromises => {
			console.log(playerPromises);
			console.log(when.all(playerPromises));
			return when.all(playerPromises);
		}).done(players => {
			console.log(players);
			this.setState({
				players: players,
				attributes: Object.keys(this.schema.properties),
				pageSize: pageSize,
				links: this.links
			});
		});
	}

	onCreate(newPlayer) {
		follow(client, root, ['players']).then(playerCollection => {
			return client({
				method: 'POST',
				path: playerCollection.entity._links.self.href,
				entity: newPlayer,
				headers: {'Content-Type': 'application/json'}
			})
		}).then(response => {
			return follow(client, root, [
				{rel: 'players', params: {'size': this.state.pageSize}}]);
		}).done(response => {
			if (typeof response.entity._links.last != "undefined") {
				this.onNavigate(response.entity._links.last.href);
			} else {
				this.onNavigate(response.entity._links.self.href);
			}
		});
	}

	onDelete(player) {
		client({method: 'DELETE', path: player._links.self.href}).done(response => {
			this.loadFromServer(this.state.pageSize);
		});
	}

	onUpdate(player, updatedPlayer) {
		client({
			method: 'PUT',
			path: player.entity._links.self.href,
			entity: updatedPlayer,
			headers: {
				'Content-Type': 'application/json',
				'If-Match': player.headers.Etag
			}
		}).done(response => {
			this.loadFromServer(this.state.pageSize);
		}, response => {
			if (response.status.code === 412) {
				alert('DENIED: Unable to update ' +
					player.entity._links.self.href + '. Your copy is stale.');
			}
		});
	}

	onNavigate(navUri) {
		client({
			method: 'GET',
			path: navUri
		}).then(playerCollection => {
			this.links = playerCollection.entity._links;

			return playerCollection.entity._embedded.players.map(player =>
					client({
						method: 'GET',
						path: player._links.self.href
					})
			);
		}).then(playerPromises => {
			return when.all(playerPromises);
		}).done(players => {
			this.setState({
				players: players,
				attributes: Object.keys(this.schema.properties),
				pageSize: this.state.pageSize,
				links: this.links
			});
		});
	}

	updatePageSize(pageSize) {
		if (pageSize !== this.state.pageSize) {
			this.loadFromServer(pageSize);
		}
	}

	componentDidMount() {
		this.loadFromServer(this.state.pageSize);
	}
	
	render() {
		return (
			<div>
				<CreateDialog 
					attributes={this.state.attributes} 
					onCreate={this.onCreate}/>
				<PlayerList 
					players={this.state.players}
					links={this.state.links}
					attributes={this.state.attributes}
					onNavigate={this.onNavigate}
					onUpdate={this.onUpdate}
					onDelete={this.onDelete}
					pageSize={this.state.pageSize}
					updatePageSize={this.updatePageSize}/>
			</div>
		)
	}
}

class UpdateDialog extends React.Component {

	constructor(props) {
		super(props);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleSubmit(e) {
		e.preventDefault();
		var updatedPlayer = {};
		this.props.attributes.forEach(attribute => {
			updatedPlayer[attribute] = ReactDOM.findDOMNode(this.refs[attribute]).value.trim();
		});
		this.props.onUpdate(this.props.player, updatedPlayer);
		window.location = "#";
	}

	render() {
		var inputs = this.props.attributes.map(attribute =>
				<p key={this.props.player.entity[attribute]}>
					<input type="text" placeholder={attribute}
						   defaultValue={this.props.player.entity[attribute]}
						   ref={attribute} className="field" />
				</p>
		);

		var dialogId = "updatePlayer-" + this.props.player.entity._links.self.href;

		return (
			<div key={this.props.player.entity._links.self.href}>
				<a href={"#" + dialogId}>Update</a>
				<div id={dialogId} className="modalDialog">
					<div>
						<a href="#" title="Close" className="close">X</a>

						<h2>Update a player</h2>

						<form>
							{inputs}
							<button onClick={this.handleSubmit}>Update</button>
						</form>
					</div>
				</div>
			</div>
		)
	}

};

class CreateDialog extends React.Component {

	constructor(props) {
		super(props);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleSubmit(e) {
		e.preventDefault();
		var newPlayer = {};
		this.props.attributes.forEach(attribute => {
			newPlayer[attribute] = ReactDOM.findDOMNode(this.refs[attribute]).value.trim();
		});
		this.props.onCreate(newPlayer);

		// clear out the dialog's inputs
		this.props.attributes.forEach(attribute => {
			ReactDOM.findDOMNode(this.refs[attribute]).value = '';
		});

		// Navigate away from the dialog to hide it.
		window.location = "#";
	}

	render() {
		var inputs = this.props.attributes.map(attribute =>
			<p key={attribute}>
				<input 
					type="text" 
					placeholder={attribute} 
					ref={attribute} 
					className="field" />
			</p>
		);

		return (
			<div>
				<a href="#createPlayer">Create</a>
				<div id="createPlayer" className="modalDialog">
					<div>
						<a href="#" title="Close" className="close">X</a>
						<h2>Create new player</h2>
						<form>
							{inputs}
							<button onClick={this.handleSubmit}>Create</button>
						</form>
					</div>
				</div>
			</div>
		)
	}
}

class PlayerList extends React.Component{
	constructor(props){
		super(props);
		console.log(this.props);
		this.handleNavFirst = this.handleNavFirst.bind(this);
		this.handleNavPrev = this.handleNavPrev.bind(this);
		this.handleNavNext = this.handleNavNext.bind(this);
		this.handleNavLast = this.handleNavLast.bind(this);
		this.handleInput = this.handleInput.bind(this);
	}

	handleInput(e) {
		e.preventDefault();
		var pageSize = ReactDOM.findDOMNode(this.refs.pageSize).value;
		if (/^[0-9]+$/.test(pageSize)) {
			this.props.updatePageSize(pageSize);
		} else {
			ReactDOM.findDOMNode(this.refs.pageSize).value =
				pageSize.substring(0, pageSize.length - 1);
		}
	}

	handleNavFirst(e){
		e.preventDefault();
		this.props.onNavigate(this.props.links.first.href);
	}

	handleNavPrev(e) {
		e.preventDefault();
		this.props.onNavigate(this.props.links.prev.href);
	}

	handleNavNext(e) {
		e.preventDefault();
		this.props.onNavigate(this.props.links.next.href);
	}

	handleNavLast(e) {
		e.preventDefault();
		this.props.onNavigate(this.props.links.last.href);
	}

	render() {
		console.log(this.props.players);
		var players = this.props.players.map(player =>
			<Player 
				key={player.entity._links.self.href} 
				player={player} 
				attributes={this.props.attributes}
				onDelete={this.props.onDelete}
				onUpdate={this.props.onUpdate}/>
		);

		var navLinks = [];

		if ("first" in this.props.links) {
			navLinks.push(<button key="first" onClick={this.handleNavFirst}>&lt;&lt;</button>);
		}
		if ("prev" in this.props.links) {
			navLinks.push(<button key="prev" onClick={this.handleNavPrev}>&lt;</button>);
		}
		if ("next" in this.props.links) {
			navLinks.push(<button key="next" onClick={this.handleNavNext}>&gt;</button>);
		}
		if ("last" in this.props.links) {
			navLinks.push(<button key="last" onClick={this.handleNavLast}>&gt;&gt;</button>);
		}

		return (
			<div>
				<input 
					ref="pageSize" 
					defaultValue={this.props.pageSize} 
					onInput={this.handleInput}/>
				<table>
					<tbody>
						<tr>
							<th>UserName</th>
							<th>Nickname</th>
							<th></th>
						</tr>
						{players}
					</tbody>
				</table>
				<div>
					{navLinks}
				</div>
			</div>
		)
	}
}

class Player extends React.Component{
	constructor(props) {
		super(props);
		console.log(this.props)
		this.handleDelete = this.handleDelete.bind(this);
	}

	handleDelete() {
		this.props.onDelete(this.props.player);
	}

	render() {
		return (
			<tr>
				<td>{this.props.player.entity.userName}</td>
				<td>{this.props.player.entity.nickname}</td>
				<td>
					<UpdateDialog 
						player={this.props.player}
					  attributes={this.props.attributes}
					  onUpdate={this.props.onUpdate}/>
				</td>
				<td>
					<button onClick={this.handleDelete}>Delete</button>
				</td>
			</tr>
		)
	}
}



ReactDOM.render(
	<App />,
	document.getElementById('react')
)