/*
类型的判断

typeof 'abc' => 只能判断基本类型，判断引用类型不准确(typeof [], typeof {}, typeof null 都是object)
[].constructor => 可以判断这个实例是通过什么类型构造出来的
[] instanceof Array => 通过查找__proto__区分实例
Object.prototype.toString.call([]) => 区分具体的类型
*/

