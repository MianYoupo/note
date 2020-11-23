# vuex学习

## prettierrc的配置

```json
{
'semi':true,
'singleQuote':true
}
```

在组件中的template中，mustache中的this是可以省略的。

## mutation

在组件中千万不要直接通过store，对数据进行修改，而是使用commit进行修改的。

commit的作用，就是调用某个mutation函数。

this.$store.commit() 是触发 mutations 的第一种方式，触发 mutations 的第二种方式：

```javascript
//从 vuex 中按需导入 mapMutation 函数
import { mapMutataion } from 'vuex'
```

通过刚才导入的 mapmutations函数，将需要的 mutations I函数，映射为当前组件的 methods方法

```javascript
// 将指定的 mutations 函数，映射为当前组件的 methods 函数
methods: {
    ...mapMutations(['add','addN'])
}
```

不能再mutation中执行异步操作。

## action

action 用于处理异步任务

如果要通过一部操作变更数据，必须通过  action ，不能使用 Mutation ，但是在 action 中还是通过 mutation 进行操作的。

## getter

Getter 用于对 store 中的数据进行加工处理。

1. Getter 可以对 store 中已有的数据加工处理之后形成新的数据。
2. store 中的数据发生变化，getter 的数据也会发生变化。