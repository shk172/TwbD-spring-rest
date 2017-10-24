package main.java.dnd;
import java.util.concurrent.atomic.AtomicLong;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class PlayerController {
	@RequestMapping("/player")
	public Player player(@RequestParam(value="name", defaultValue="none") String name) {
		return new Player(name);
	}
}
