package main.java.dnd;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.rest.core.annotation.HandleAfterCreate;
import org.springframework.data.rest.core.annotation.HandleAfterDelete;
import org.springframework.data.rest.core.annotation.HandleAfterSave;
import org.springframework.data.rest.core.annotation.RepositoryEventHandler;
import org.springframework.hateoas.EntityLinks;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

@Component
@RepositoryEventHandler(Employee.class)
public class EventHandler {
	private final SimpMessagingTemplate websocket;
	
	private final EntityLinks entityLinks;
	
	@Autowired
	public EventHandler(SimpMessagingTemplate websocket, EntityLinks entityLinks) {
		this.websocket = websocket;
		this.entityLinks = entityLinks;
	}
	
	@HandleAfterCreate
	public void newPlayer(Player player) {
		this.websocket.convertAndSend(
				MESSAGE_PREFIX + "/newPlayer", getPath(player));
	}
	
	@HandleAfterDelete
	public void deletePlayer(Player player) {
		this.websocket.convertAndSend(
				MESSAGE_PREFIX + "/deletePlayer", getPath(player));
	}
	
	@HandleAfterSave
	public void updatePlayer(Player player) {
		this.websocket.convertAndSend(
				MESSAGE_PREFIX + "/updatePlayer", getPath(player));
	}
	
	/**
	 * Take an {@link Player} and get the URI using Spring Data REST's {@link EntityLinks}.
	 *
	 * @param employee
	 */
	private String getPath(Player player) {
		return this.entityLinks.linkForSingleResource(player.getClass(),
				player.getId()).toUri().getPath();
	}
}
