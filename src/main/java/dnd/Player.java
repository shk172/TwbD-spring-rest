package main.java.dnd;

import java.util.HashMap;
import java.util.Objects;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Version;
import lombok.Data;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Data
@Entity
public class Player {
	private @Id @GeneratedValue Long userID;
	private String userName;
	private String nickname;
	
	private @JsonIgnore HashMap<String, PlayerCharacter> characters;
	private @JsonIgnore HashMap<String, Player> friends;
	
	private @Version @JsonIgnore Long version;
	
	private Player() {}
	
	public Player(String userName) {
		this.userName = userName;
	}

	public Player(String userName, String nickname) {
		this.userName = userName;
		this.nickname = nickname;
	}
	
	@JsonIgnore
	public void addCharacter(String campaignID, PlayerCharacter character) {
		characters.put(campaignID, character);
	}
	
	@JsonIgnore
	public PlayerCharacter getCharacter(String campaignID) {
		return characters.get(campaignID);
	}
	
	@JsonIgnore
	public HashMap<String, PlayerCharacter> getAllCharacters(){
		return characters;
	}
	
}
