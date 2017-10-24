package main.java.dnd;
import java.util.Random;

public class Dice {
	private final int type;
	private int value;
	
	Dice(int type){
		this.type = type;
	}
	
	public int roll() {
		Random rand = new Random();
		value = rand.nextInt(type) + 1;
		return value;
	}
}
