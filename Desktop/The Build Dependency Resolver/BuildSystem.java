import java.util.Scanner;
import java.util.List;

public class BuildSystem {
    public static void main(String[] args) {
        DependencyGraph graph = new DependencyGraph();
        Scanner scanner = new Scanner(System.in);

        System.out.println("Build Resolver Ready. (Commands: DEPENDS A B, BUILD, EXIT)");

        while (true) {
            System.out.print("> ");
            String input = scanner.nextLine().trim();
            String[] parts = input.split(" ");
            String command = parts[0].toUpperCase();

            switch (command) {
                case "DEPENDS":
                    if (parts.length == 3) {
                        graph.addDependency(parts[1], parts[2]);
                    } else {
                        System.out.println("Usage: DEPENDS <File> <Dependency>");
                    }
                    break;

                case "BUILD":
                    try {
                        List<String> order = graph.getBuildOrder();
                        for (int i = 0; i < order.size(); i++) {
                            System.out.println((i + 1) + ". " + order.get(i));
                        }
                    } catch (Exception e) {
                        System.out.println("ERROR: " + e.getMessage());
                    }
                    break;

                case "EXIT":
                    return;

                default:
                    System.out.println("Unknown command.");
            }
        }
    }
}