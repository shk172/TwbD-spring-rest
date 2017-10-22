package main.java.dnd;

import java.util.HashSet;
import java.util.HashMap;

public class Campaign {
	private final String id;
	private HashMap<String, Player> players;
	private HashMap<String, Character> npcs;
	
	Campaign(String id){
		this.id = id;
	}
	
	public void addPlayer(String id, Player player) {
		players.put(id, player);
	}
	
	public void removePlayer(String playerID) {
		players.remove(id);
	}
	
	public void addNPC(String name, Character NPC) {
		npcs.put(name, NPC);
	}
	
	public void removeNPC(String name) {
		npcs.remove(name);
	}
	
	public String getId() {
		return id;
	}
}
