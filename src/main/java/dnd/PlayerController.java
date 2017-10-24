package main.java.dnd;
import java.util.concurrent.atomic.AtomicLong;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class PlayerController {
	@RequestMapping("/player")
	public Player player(@RequestParam(value="username", defaultValue="none") String username, @RequestParam(value="nickname", defaultValue="none") String nickname) {
		return new Player(username, nickname);
	}
}
