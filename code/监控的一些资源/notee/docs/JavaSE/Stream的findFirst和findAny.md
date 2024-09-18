# Stream 的 findFirst 和 findAny

## findFirst

从整数流中找到第一个元素。

```java
public class Java8FindFirstExample1 {

    public static void main(String[] args) {

        List<Integer> list = Arrays.asList(1, 2, 3, 2, 1);

        Optional<Integer> first = list.stream().findFirst();
        if (first.isPresent()) {
            Integer result = first.get();
            System.out.println(result);       // 1
        } else {
            System.out.println("no value?");
        }

        Optional<Integer> first2 = list
                .stream()
                .filter(x -> x > 1).findFirst();

        if (first2.isPresent()) {
            System.out.println(first2.get()); // 2
        } else {
            System.out.println("no value?");
        }
    }
}
```

## findAny

从整数流中查找任何元素。 如果我们运行下面的程序，大多数情况下，结果是 2，看起来`findAny()`总是返回第一个元素？ 但是，对此**无法保证** ， `findAny()`可以从 Stream 返回任何元素。

```java

public class Java8FindAnyExample1 {

    public static void main(String[] args) {

        List<Integer> list = Arrays.asList(1, 2, 3, 4, 5, 6, 7, 8, 9, 10);

        Optional<Integer> any = list.stream().filter(x -> x > 1).findAny();
        if (any.isPresent()) {
            Integer result = any.get();
            System.out.println(result);
        }
}
```
