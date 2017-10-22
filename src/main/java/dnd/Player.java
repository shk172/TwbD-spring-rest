package main.java.dnd;

import java.util.HashMap;
import java.util.Objects;
public class Player {
	private final int userID;
	private final String userName;
	private HashMap<String, Player> campaigns;
	
	Player(String userName) {
		this.userName = userName;
		this.userID = Objects.hashCode(userName);
	}
	
	public String getUserName() {
		return userName;
	}
	
	public int getUserID() {
		return userID;
	}
}
