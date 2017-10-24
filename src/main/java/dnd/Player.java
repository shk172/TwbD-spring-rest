package main.java.dnd;

import java.util.HashMap;
import java.util.Objects;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import lombok.Data;

@Entity
public class Player {
	private @Id @GeneratedValue final long userID;
	private final String userName;
	private final String nickname;
	private HashMap<String, PlayerCharacter> characters;
	private HashMap<String, Player> friends;
	
	Player(String userName) {
		this.userName = userName;
		this.userID = Objects.hashCode(userName);
	}
	
	public void setUserName(String userName) {
		this.userName = userName;
	}
	
	public String getUserName() {
		return userName;
	}
	
	public void setNickname(String nickname) {
		this.nickname = nickname;
	}
	
	public String getNickname() {
		return nickname;
	}
	
	public void setUserID(long userID) {
		this.userID = userID;
	}
	
	public long getUserID() {
		return userID;
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
