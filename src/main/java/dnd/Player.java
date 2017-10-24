package main.java.dnd;

import java.util.HashMap;
import java.util.Objects;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import lombok.Data;

@Data
@Entity
public class Player {
	private @Id @GeneratedValue long userID;
	private String userName;
	private String nickname;
	private HashMap<String, PlayerCharacter> characters;
	private HashMap<String, Player> friends;
	
	private Player() {}
	
	public Player(String userName) {
		this.userName = userName;
		this.userID = Objects.hashCode(userName);
	}

	public Player(String userName, String nickname) {
		this.userName = userName;
		this.nickname = nickname;
		this.userID = Objects.hashCode(userName);
	}
	
	public void addCharacter(String campaignID, PlayerCharacter character) {
		characters.put(campaignID, character);
	}
	
	public PlayerCharacter getCharacter(String campaignID) {
		return characters.get(campaignID);
	}
	
	public HashMap<String, PlayerCharacter> getAllCharacters(){
		return characters;
	}


}
