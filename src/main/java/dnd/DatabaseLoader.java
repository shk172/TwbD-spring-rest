package main.java.dnd;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DatabaseLoader implements CommandLineRunner {

	private final PlayerRepository repository;
	
	@Autowired
	public DatabaseLoader(PlayerRepository repository) {
		this.repository = repository;
	}
	
	@Override
	public void run(String...strings) throws Exception{
		this.repository.save(new Player("SangHee", "Seylan"));
		this.repository.save(new Player("Ali", "Rosaria"));
		this.repository.save(new Player("Kristen", "Clark"));
		this.repository.save(new Player("abc", "cde"));
		this.repository.save(new Player("fgh", "ijk"));
		this.repository.save(new Player("lmn", "opq"));
	}
	
}
