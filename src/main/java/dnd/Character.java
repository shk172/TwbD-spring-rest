package main.java.dnd;

import java.util.HashMap;

public class Character {
	private final String name;
	private final String baseClass;
	private final String campaignID;
	private final String race;
	
	HashMap<String, Integer> stats;
	HashMap<String, Integer> savingThrows;
	HashMap<String, Integer> skills;
	
	private int level;
	private int health;
	private int exp;
	private int money;

	//Stats
	private int armorClass;
	private int charisma;
	private int constitution;
	private int dexterity;
	private int intelligence;
	private int initiative;
	private int speed;
	private int strength;
	private int wisdom;
		
	//Saving Throws
	private int charismaST;
	private int constitutionST;
	private int dexterityST;
	private int intelligenceST;
	private int strengthST;
	private int wisdomST;
	
	//Skills
	private int acrobatics;
	private int animalHandling;
	private int arcana;
	private int athletics;
	private int deception;
	private int history;
	private int insight;
	private int intimidation;
	private int investigation;
	private int medicine;
	private int nature;
	private int perception;
	private int performance;
	private int persuasion;
	private int religion;
	private int sleightOfHand;
	private int stealth;
	private int survival;
	
	
	Character(String name, String campaignID, String baseClass, String race){
		this.name = name;
		this.campaignID = campaignID;
		this.baseClass = baseClass;
		this.race = race;
	}
	
	public void setStat(String stat, int num) {
		stats.put(stat, num);
	}
	
	public int getStat(String stat) {
		return stats.get(stat);
	}
	
	public void setSavingThrows(String st, int num) {
		savingThrows.put(st, num);
	}
	
	public int getSavingThrows(String st) {
		return savingThrows.get(st);
	}
	
	public void setSkills(String sk, int num) {
		savingThrows.put(sk, num);
	}
	
	public int getSkills(String sk) {
		return savingThrows.get(sk);
	}
}
