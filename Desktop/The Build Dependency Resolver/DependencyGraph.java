import java.util.*;

public class DependencyGraph {
    private final Map<String, List<String>> adjList = new HashMap<>();
    private final Map<String, Integer> inDegree = new HashMap<>();
    private final Set<String> allNodes = new HashSet<>();

    public void addDependency(String child, String parent) {
        allNodes.add(child);
        allNodes.add(parent);

        adjList.putIfAbsent(parent, new ArrayList<>());
        adjList.get(parent).add(child);

        inDegree.put(child, inDegree.getOrDefault(child, 0) + 1);
        inDegree.putIfAbsent(parent, 0);
    }

    public List<String> getBuildOrder() throws Exception {
        List<String> order = new ArrayList<>();
        Queue<String> queue = new LinkedList<>();
        
        // Create a copy of in-degrees to avoid destroying the graph state during BUILD
        Map<String, Integer> currentInDegree = new HashMap<>(inDegree);

        for (String node : allNodes) {
            if (currentInDegree.getOrDefault(node, 0) == 0) {
                queue.add(node);
            }
        }

        while (!queue.isEmpty()) {
            String current = queue.poll();
            order.add(current);

            for (String neighbor : adjList.getOrDefault(current, new ArrayList<>())) {
                currentInDegree.put(neighbor, currentInDegree.get(neighbor) - 1);
                if (currentInDegree.get(neighbor) == 0) {
                    queue.add(neighbor);
                }
            }
        }

        if (order.size() != allNodes.size()) {
            throw new Exception("Circular dependency detected!");
        }
        return order;
    }
}