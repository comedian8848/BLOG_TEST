---
title: 基于 C 的 Lisp 编译器
date: 2021-10-14
tags:
  - C/C++
categories:
  - Toy
---

——参考书籍《Build Your Own Lisp》

> 一款用c实现的微型编译器，词法、语法分析由`mpc.h/mpc.c`库提供

## 实现交互

~~~c
#include <stdio.h>

static char input[2084];

int main(){

	puts("Lispy Version 0.0");
	puts("Press Ctrl+c to Exit\n");

	while(1){
		fputs("lispy>", stdout);
		fgets(input, 2084, stdin);
		cout << "Now you're a " << input << endl;
	}
	return 0;
}

~~~

readline函数

~~~c
#include <stdio.h>
#include <string.h>
#include "mpc.h"
//如果在WIN32环境，用自己写的readLine
#ifdef _WIN32
//维护一个字符数组作为输入缓冲 
static char buffer[2084];
                                                                                 
//fputs、fgets、strcpy 
char* readLine(char* prompt){
	fputs(prompt, stdout);
	fgets(buffer, 2084, stdin);
	
	char* cpy = malloc(strlen(buffer)+1);
	
	strcpy(cpy, buffer);
	cpy[strlen(cpy) - 1] = '\0';
	
	return cpy;
}

//记录输入历史，上键复制上条指令的功能WIN32控制台自带 
void add_history(char* unused){}

//若在linux环境，引入包readline.h、history.h 
#else
#include <readline/readline.h>
#include <readline/history.h>
#endif
~~~

main

```c
//run this program using the console pauser or add your own getch, system("pause") or input loop
int main(int argc, char *argv[]) {
	
	puts("Lispy Version 0.1\nPress Ctrl+c to Exit\n");
	
	while(1){
		char* input = readLine("lispy>");
		add_history(input);
		printf("Now you're a %s\n", input);
		free(input);
	}
	
	return 0;
}
```

## 实现简单文法

利用mpc库实现简单文法

```c
int first_mpc(){
	
	mpc_parser_t* Adjective = mpc_or(4,
		mpc_sym("wow"), mpc_sym("many"),
		mpc_sym("so"), mpc_sym("such")
	);
	
	mpc_parser_t* Noun = mpc_or(5,
		mpc_sym("lisp"), mpc_sym("language"),
		mpc_sym("book"), mpc_sym("build"),
		mpc_sym("c")
	);
	
	mpc_parser_t* Phrase = mpc_and(2, mpcf_strfold,
		Adjective, Noun, free
	);
	
	mpc_parser_t* Doge = mpc_many(mpcf_strfold, Phrase);

	mpc_delete(Doge);
	
	printf("hahaha\n");
	return 0;
}
```

main 函数

~~~c
int main(){
	mpc_parser_t* Adjective = mpc_new("adjective");
	mpc_parser_t* Noun = mpc_new("noun");
	mpc_parser_t* Phrase = mpc_new("phrase");
	mpc_parser_t* Doge = mpc_new("doge");
	
	mpca_lang(MPCA_LANG_DEFAULT,
		"adjective: \"wow\" | \"such\" | \"so\" | \"such\"; noun: \"lisp\" | \"language\" | \"book\" | \"build\" | \"C\"; phrase: <adjective> <noun>; doge: <phrase>*;",
		Adjective, Noun, Phrase, Doge
	);
	
	return 0;
}
~~~

## 计算语法树

前缀表达式递归计算（栈）

```c
long eval_op(long x, char* op, long y){
	if(strcmp(op, "+") == 0)	return x+y;
	if(strcmp(op, "-") == 0)	return x-y;
	if(strcmp(op, "*") == 0)	return x*y;
	if(strcmp(op, "/") == 0)	return x/y;
	
	return 0;
}

long eval(mpc_ast_t* t){
	if(strstr(t->tag, "number")){
		return atoi(t->contents);
	}
	char * op = t->children[1]->contents;
	long x = eval(t->children[2]);
	int i = 3;
	while(strstr(t->children[i]->tag, "expr")){
		x = eval_op(x, op, eval(t->children[i]));
		i++;
	}
	return x; 
} 
```

main 函数

~~~c
int main(int argc, char** argv){
	mpc_parser_t* Number = mpc_new("number");
	mpc_parser_t* Operator = mpc_new("operator");
	mpc_parser_t* Expr = mpc_new("expr");
	mpc_parser_t* Lispy = mpc_new("lispy");

	mpca_lang(MPCA_LANG_DEFAULT,
		"number:/-?[0-9]+/; operator:'+'|'-'|'*'|'/'; expr:<number>|'('<operator><expr>+')'; lispy:/^/<operator><expr>+/$/;",
		Number, Operator, Expr, Lispy
	);	
	puts("Lispy Version 0.3\nPress Ctrl+c to Exit\n");
	
	while(1){
		char* input = readLine("lispy>");
		add_history(input);	
		mpc_result_t res;
		if(mpc_parse("<stdin>", input, Lispy, &res)){
			long ans = eval(res.output);
			mpc_ast_print(res.output);
			printf("\n  The answer is %li\n", ans);
			mpc_ast_delete(res.output);
		}else{
			mpc_err_print(res.error);
			mpc_err_delete(res.error);
		}
		
		free(input);
	}
	
	mpc_cleanup(4, Number, Operator, Expr, Lispy);
	return 0;
}

~~~

## 错误处理

引入类型 lval_err 用 char* 标识错误类型

```c
//枚举：0，1，2 
enum{
	LERR_DIV_ZERO, 
	LERR_BAD_OP, 
	LERR_BAD_NUM 
};

enum{
	LVAL_NUM,
	LVAL_ERR
};

typedef struct{
	int type;
	//如果是数字，num储存其值 
	long num;
	//如果是错误，err存储其错误类型，枚举类LERR_DIV_ZERO...
	int err;
} lval;

lval lval_num(long x){
	lval l;
	l.type = LVAL_NUM;
	l.num = x;
	return l;
}

lval lval_err(int x){
	lval l;
	l.type = LVAL_ERR;
	l.err = x;
	return l;
}

void lval_print(lval v){
	
	switch(v.type){
		case LVAL_NUM: printf("%li", v.num); break;
		case LVAL_ERR:
			if(v.err == LERR_DIV_ZERO){
				printf("Error: Division By Zero!");
			}
			if(v.err == LERR_BAD_OP){
				printf("Error: Invalid Operator!");
			}
			if(v.err == LERR_BAD_NUM){
				printf("Error: Invalid Number!");
			}
			//printf("hahaha");
			break;
	}
}

void lval_println(lval v){
	lval_print(v);
	putchar('\n');
}
```

调整文法

~~~c
lval eval_op(lval x, char* op, lval y){
	
	if(x.type == LVAL_ERR){
		return x;
	}
	if(y.type == LVAL_ERR){
		return y;
	}
	
	if(strcmp(op, "+") == 0)	return lval_num(x.num+y.num);
	if(strcmp(op, "-") == 0)	return lval_num(x.num-y.num);
	if(strcmp(op, "*") == 0)	return lval_num(x.num*y.num);
	if(strcmp(op, "/") == 0){
		return y.num == 0
			? lval_err(LERR_DIV_ZERO)
			: lval_num(x.num/y.num);
	}
	
	return lval_err(LERR_BAD_OP);
}

lval eval(mpc_ast_t* t){
	
	if(strstr(t->tag, "number")){
		errno = 0;
		long x = strtol(t->contents, NULL, 10);
		//ERANGE(erange)是c标准函式库中的标头档，定义了通过误码来汇报错误咨询的宏 
		return errno != ERANGE
			? lval_num(x)
			: lval_err(LERR_BAD_NUM);
	}
	
	char * op = t->children[1]->contents;
	lval x = eval(t->children[2]);
	
	int i = 3;
	while(strstr(t->children[i]->tag, "expr")){
		x = eval_op(x, op, eval(t->children[i]));
		i++;
	}
	
	return x; 
} 
~~~

main 函数

```c
int main(int argc, char** argv){
	
	mpc_parser_t* Number = mpc_new("number");	
	mpc_parser_t* Operator = mpc_new("operator");	
	mpc_parser_t* Expr = mpc_new("expr");	
	mpc_parser_t* Lispy = mpc_new("lispy");	
	mpca_lang(MPCA_LANG_DEFAULT,
		//用mpc进行文法定义 
		"\
			number: /-?[0-9]+/; 						\
			operator: '+'|'-'|'*'|'/'; 					\
			expr: <number>|'('<operator><expr>+')'; 	\
			lispy: /^/<operator><expr>+/$/;				\
		",
		Number, Operator, Expr, Lispy
	);
	
	puts("Lispy Version 0.4\nPress Ctrl+c to Exit\n");
	
	while(1){
		char* input = readLine("lispy>");
		add_history(input);
		
		mpc_result_t res;
		if(mpc_parse("<stdin>", input, Lispy, &res)){
			lval ans = eval(res.output);
			mpc_ast_print(res.output);
			lval_println(ans);
			mpc_ast_delete(res.output);
		}else{
			mpc_err_print(res.error);
			mpc_err_delete(res.error);
		}
		
		free(input);
	}
	
	mpc_cleanup(4, Number, Operator, Expr, Lispy);
	
	return 0;
}
```

## 引入S-expression

~~~c
/**
 * prompt:促使 
 * lvalue:左值
 * expression:表达式
 * evalution:求值 
 * parser:编译 
 * S-expression:lisp特有的表达式 
 * mpc_ast_t:是mpc_parser_t(编译树)的结果式(tree.output)，一颗语法树 
 * errno\ERANGE:是c语言stdlib.h库中的定义的错误码，定义为整数值的宏 
*/ 

//构造 
enum{ LVAL_ERR, LVAL_NUM, LVAL_SYM, LVAL_SEXPR };

typedef struct lval{
	int type;
	long num;
	//用字符串来表示错误和符号更完整高效 
	char* err;
	char* sym;
	//记录当前左值能推出的表达式数量
	int count;
	//储存表达式（类型为lval*），用lval*的指针储存，即双指针lval** 
	struct lval** cell; 
} lval;

//使用指针构造提升效率 
lval* lval_num(long x){
	lval* v = malloc(sizeof(lval));
	v->type = LVAL_NUM;
	v->num = x;
	return v;
}

lval* lval_err(char* m){
	lval* v = malloc(sizeof(lval));
	v->type = LVAL_ERR;
	v->err = malloc(strlen(m)+1);
	strcpy(v->err, m);
	return v;
}

lval* lval_sym(char* s){
	lval* v = malloc(sizeof(lval));
	v->type = LVAL_SYM;
	v->sym = malloc(strlen(s)+1);
	strcpy(v->sym, s);
	return v;
}

lval* lval_sexpr(void){
	lval* v = malloc(sizeof(lval));
	v->type = LVAL_SEXPR;
	v->count = 0;
	v->cell = NULL;
	return v; 
}

void lval_del(lval* v){
	
	switch(v->type){
		case LVAL_NUM: break;
		//释放字符指针 
		case LVAL_ERR: free(v->err); break;
		case LVAL_SYM: free(v->sym); break;
		
		case LVAL_SEXPR:{
			int i;
			//将后继表达式依次释放，递归调用lval_del
			for(i = 0; i < v->count; i++){
				lval_del(v->cell[i]);
			}
			//释放lval双指针 
			free(v->cell);
			break;
		}
	}
	//释放自身lval指针 
	free(v);
}



//realloc函数，重新对指针分配空间大小 
lval* lval_add(lval* v, lval* x){
	v->count++;
	v->cell = realloc(v->cell, sizeof(lval*)*v->count);
	v->cell[v->count-1] = x;
	return v;
}


//将指定子节点弹栈，同时重定义指针空间 
lval* lval_pop(lval* v, int i){
	lval* x = v->cell[i];
	
	memmove(&v->cell[i], &v->cell[i+1], sizeof(lval*)*(v->count-i-1));
	
	v->count--;
	v->cell = realloc(v->cell, sizeof(lval*)*v->count);
	return x;
}

lval* lval_take(lval* v, int i){
	lval* x = lval_pop(v, i);
	lval_del(v);
	return x; 
}

//打印 
//打印输出一个左推导，与打印输出一个s-express表达式互相嵌套，实现表达式的打印 
void lval_expr_print(lval* v, char open, char close);

void lval_print(lval* v){
	switch(v->type){
		case LVAL_NUM: printf("%li", v->num); break;
		case LVAL_ERR: printf("Error: %s", v->err); break;
		case LVAL_SYM: printf("%s", v->sym); break;
		case LVAL_SEXPR: lval_expr_print(v, '(', ')'); break;
	}
}

void lval_expr_print(lval* v, char open, char close){
	putchar(open);
	int i;
	for(i = 0; i < v->count; i++){
		lval_print(v->cell[i]);
		if(i == v->count-1){
			putchar(' ');
		}
	}
	putchar(close);
}

void lval_println(lval* v){
	lval_print(v);
	putchar('\n');
}

// 内建计算函数
lval* builtin_op(lval* a, char* op){
	int i;
	for(i = 0; i < a->count; i++){
		if(a->cell[i]->type != LVAL_NUM){
			lval_del(a);
			return lval_err("Cannot operate on non-number!");
		}
	}
	
	//开始弹栈，进行计算 
	lval* x = lval_pop(a, 0);
	if((strcmp(op, "-") == 0) && a->count == 0){
		x->num = -x->num;
	}
	
	//因为已经由语法树构造好了计算顺序，已经考虑过了优先级问题 
	while(a->count > 0){
		lval* y = lval_pop(a, 0);
		
		if(strcmp(op, "+") == 0){
			x->num += y->num;
		}else if(strcmp(op, "-") == 0){
			x->num -= y->num;
		}else if(strcmp(op, "*") == 0){
			x->num *= y->num;
		}else if(strcmp(op, "/") == 0){
			if(y->num == 0){
				//释放空间 
				lval_del(x);
				lval_del(y);
				x = lval_err("Division By Zero!");
				break;
			}
			x->num /= y->num;
		}
		lval_del(y);
	}
	
	lval_del(a);
	return x;
}

//计算
lval* lval_eval(lval* v); 
lval* lval_eval_sexpr(lval* v){
	//计算子节点
	int i;
	for(i = 0; i < v->count; i++){
		v->cell[i] = lval_eval(v->cell[i]);
	}
	for(i = 0; i < v->count; i++){
		if(v->cell[i]->type == LVAL_ERR){
			return lval_take(v, i);
		}
	}
	
	if(v->count == 0)	return v;
	if(v->count == 1)	return lval_take(v, 0);
	
	lval* f = lval_pop(v, 0);
	if(f->type != LVAL_SYM){
		lval_del(f);
		lval_del(v);
		return lval_err("S-expression Does not start with symbol!");
	}
	
	lval* result = builtin_op(v, f->sym);
	lval_del(f);
	return result;
}

lval* lval_eval(lval* v){
	if(v->type == LVAL_SEXPR){
		return lval_eval_sexpr(v);
	}
	return v;
}

//将语法树的数字部分转换为token返回 
lval* lval_read_num(mpc_ast_t* t){
	errno = 0;
	//strtol:将字符串转换为长整型，第二个参数为指向不可转换的char*的位置(即在此处停止转换)，10为进制 
	long x = strtol(t->contents, NULL, 10);
	return errno != ERANGE ?
		lval_num(x): lval_err("invalid number"); 
}

//将生成的抽象语法树转化为s-expression表达式 
lval* lval_read(mpc_ast_t* t){
	//strstr:匹配两字符串 
	if(strstr(t->tag, "number"))	return lval_read_num(t);
	if(strstr(t->tag, "symbol"))	return lval_sym(t->contents);
	
	lval* x = NULL;
	//strcmp:比较两字符串，返回字符串(大小)str1-str2，当为0二者相同 
	if(strcmp(t->tag, ">") == 0 || strstr(t->tag, "sexpr"))	x = lval_sexpr();
	
	int i;
	for(i = 0; i< t->children_num; i++){
		if(strcmp(t->children[i]->contents, "(") == 0
			|| strcmp(t->children[i]->contents, ")") == 0
			|| strcmp(t->children[i]->contents, "{") == 0
			|| strcmp(t->children[i]->contents, "}") == 0
			|| strcmp(t->children[i]->tag, "regex") == 0)
			{
			continue;
		}
		x = lval_add(x, lval_read(t->children[i]));
	}		
	return x;
}
~~~

main 函数

```c
int main(){
	
	//定义新的文法 
	mpc_parser_t* Number = mpc_new("number");	
	mpc_parser_t* Symbol = mpc_new("symbol");	
	mpc_parser_t* Sexpr = mpc_new("sexpr");	
	mpc_parser_t* Expr = mpc_new("expr");	
	mpc_parser_t* Lispy = mpc_new("lispy");	
	mpca_lang(MPCA_LANG_DEFAULT,
		"											\
			number: /-?[0-9]+/;						\
			symbol: '+' | '-' | '*' | '/';			\
			sexpr: '(' <expr>* ')';					\
			expr: <number> | <symbol> | <sexpr>;	\
			lispy: /^/ <expr>* /$/;					\
		",
		Number, Symbol, Sexpr, Expr, Lispy
	);
	
	puts("Lispy Version 0.5\nPress Ctrl+c to Exit\n");
	while(1){
		char* input = readLine("lispy>");
		add_history(input);
		
		mpc_result_t res;
		if (mpc_parse("<stdin>", input, Lispy, &res)) {
      		lval* x = lval_eval(lval_read(res.output));
      		mpc_ast_print(res.output);
     		lval_println(x);
      		lval_del(x);
      		mpc_ast_delete(res.output);
    	} else {    
      		mpc_err_print(res.error);
      		mpc_err_delete(res.error);
   		}
		
		free(input);
	}
	
	//释放树的空间 
	mpc_cleanup(5, Number, Symbol, Sexpr, Expr, Lispy);
	return 0; 
}
```

## 引入Q-expression

~~~c
//宏定义断言 
#define LASSERT(args, cond, err) \
	if(cond){ lval_del(args); return lval_err(err); }


//枚举左推导类型 
enum{ LVAL_ERR, LVAL_NUM, LVAL_SYM, LVAL_SEXPR, LVAL_QEXPR };


lval* lval_qexpr(void){
	lval* v = malloc(sizeof(lval));
	v->type = LVAL_QEXPR;
	v->count = 0;
	v->cell = NULL;
	return v;
}

void lval_del(lval* v){
	
	switch(v->type){
		case LVAL_NUM: break;
		//释放字符指针 
		case LVAL_ERR: free(v->err); break;
		case LVAL_SYM: free(v->sym); break;
		
		//二者删除逻辑一模一样，碰到Qexpr不退出继续执行即可 
		case LVAL_QEXPR:
		case LVAL_SEXPR:{
			int i;
			//将后继表达式依次释放，递归调用lval_del
			for(i = 0; i < v->count; i++){
				lval_del(v->cell[i]);
			}
			//释放lval双指针 
			free(v->cell);
			break;
		}
	}
	//释放自身lval指针 
	free(v);
}

//打印 
//打印输出一个左推导，与打印输出一个s-express表达式互相嵌套，实现表达式的打印 
void lval_expr_print(lval* v, char open, char close);

void lval_print(lval* v){
	switch(v->type){
		case LVAL_NUM: printf("%li", v->num); 			break;
		case LVAL_ERR: printf("Error: %s", v->err); 	break;
		case LVAL_SYM: printf("%s", v->sym); 			break;
		case LVAL_SEXPR: lval_expr_print(v, '(', ')'); 	break;
		case LVAL_QEXPR: lval_expr_print(v, '{', '}'); 	break;
	}
}

// 内建函数：head函数，没用宏断言:删除传入左值a->cell中下标为1到最后的所有元素，即只返回cell[0] 
lval* builtin_head(lval* a){
	//错误检测 
	if(a->count != 1){
		lval_del(a);
		return lval_err("Function 'head' passed too many arguments!");
	}
	if(a->cell[0]->type != LVAL_QEXPR){
		lval_del(a);
		return lval_err("Function 'head' passed incorrect types!");
	}
	if(a->cell[0]->count == 0){
		lval_del(a);
		return lval_err("Function 'head' passed {}!");
	}
	
	//排除错误后取出第一个推导 
	lval* v = lval_take(a, 0);
	
	while(v->count >1){
		lval_del(lval_pop(v, 1));
	} 
	//获得最右推导 
	return v;
}

// 内建函数：tail函数，不用宏断言:删除传入左值a->cell中下标为0的元素，即第一个元素 
lval* builtin_tail(lval* a){
	//检错 
	if(a->count != 1){
		lval_del(a);
		return lval_err("Function 'tail' passed too many arguments!");
	}
	if(a->cell[0]->type != LVAL_QEXPR){
		lval_del(a);
		return lval_err("Function 'tail' passed incorrect type!"); 
	}
	if(a->cell[0]->count == 0){
		lval_del(a);
		return lval_err("Function 'tail' passed {}!");
	}
	
	lval* v = lval_take(a, 0);
	
	lval_del(lval_pop(v, 0));
	return v;
}

// 内建函数：list函数，将S-expression转换为Q-expression 
lval* builtin_list(lval* a){
	a->type = LVAL_QEXPR;
	return a;
}

//声明lval_eval函数:其功能是，若a->type==SEXPR，则返回S-expression表达式处理结果，否则直接返回a 
lval* lval_eval(lval* v); 

//5、eval函数，将Q-expression转换为S-expression
lval* builtin_eval(lval* a){
	//用宏断言处理的错误检查，若cond，则lval_del(args)并且return lval_err(err) 
	LASSERT(a, a->count!=1, "Function 'eval' passed too many arguments!");
	LASSERT(a, a->cell[0]->type!=LVAL_QEXPR, "Function 'eval' passed incorrect type!");
	
	lval* x = lval_take(a, 0);
	x->type = LVAL_SEXPR;
	return lval_eval(x);
} 

//lval_join，类似于builtin_op函数，返回两个Q-expression的合并结果
//合并即指:将y加入到x的cell中，同时释放y原有空间 
lval* lval_join(lval* x, lval* y){
	while(y->count > 0){
		x = lval_add(x, lval_pop(y, 0));
	}
	
	lval_del(y);
	return x;
}


//7、通过循环调用lval_join计算一个Q-expression表达式 
lval* builtin_join(lval* a){
	int i;
	//检查推导中是否含有不属于Q-expression的产生式 
	for(i = 0; i < a->count; i++){
		LASSERT(a, a->cell[i]->type!=LVAL_QEXPR, "Function 'join' passed incorrect type");
	}
	
	lval* x = lval_pop(a, 0);
	while(a->count > 0){
		x = lval_join(x, lval_pop(a, 0));
	}
	
	lval_del(a);
	return x;
} 

//查找内建函数
lval* builtin(lval* a, char* func){
	if(strcmp("list", func) == 0){
		return builtin_list(a);
	} 
	if(strcmp("head", func) == 0){
		return builtin_head(a);
	} 
	if(strcmp("tail", func) == 0){
		return builtin_tail(a);
	} 
	if(strcmp("join", func) == 0){
		return builtin_join(a);
	} 
	if(strcmp("eval", func) == 0){
		return builtin_eval(a);
	} 
	if(strstr("+-*/", func)){
		return builtin_op(a, func);
	}
	//如果都没有匹配成功 
	lval_del(a);
	return lval_err("Unknown Function!");
} 

//计算S-expression表达式的结果
lval* lval_eval_sexpr(lval* v){
	//计算相邻子节点之和 
	int i;
	for(i = 0; i < v->count; i++){
		v->cell[i] = lval_eval(v->cell[i]);
	}
	for(i = 0; i < v->count; i++){
		if(v->cell[i]->type == LVAL_ERR){
			return lval_take(v, i);
		}
	}
	
	if(v->count == 0)	return v;
	if(v->count == 1)	return lval_take(v, 0);
	
	lval* f = lval_pop(v, 0);
	if(f->type != LVAL_SYM){
		lval_del(f);
		lval_del(v);
		return lval_err("S-expression Does not start with symbol!");
	}
	
	//在此处调用了内建函数，让f->sym(函数名)得以识别，无需在Symbol中直接定义函数 
	lval* result = builtin(v, f->sym);
	lval_del(f);
	return result;
}
~~~

main

```c
int main(){
	
	//定义新的文法 
	mpc_parser_t* Number = mpc_new("number");	
	mpc_parser_t* Symbol = mpc_new("symbol");	
	mpc_parser_t* Sexpr = mpc_new("sexpr");
	mpc_parser_t* Qexpr = mpc_new("qexpr");	
	mpc_parser_t* Expr = mpc_new("expr");	
	mpc_parser_t* Lispy = mpc_new("lispy");	
	mpca_lang(MPCA_LANG_DEFAULT,
		//在symbol中定义内建函数，让语法树能够识别 
		"															\
			number: /-?[0-9]+/;										\
			symbol: \"list\" | \"head\" | \"tail\" | \"join\" 		\
					| \"eval\" | '+' | '-' | '*' | '/';				\
			sexpr: '(' <expr>* ')';									\
			qexpr: '{' <expr>* '}';									\
			expr: <number> | <symbol> | <sexpr> | <qexpr>;			\
			lispy: /^/ <expr>* /$/;									\
		",
		Number, Symbol, Sexpr, Qexpr, Expr, Lispy
	);
	
	puts("Lispy Version 0.6\nPress Ctrl+c to Exit\n");
	while(1){
		char* input = readLine("lispy>");
		add_history(input);
		
		mpc_result_t res;
		if (mpc_parse("<stdin>", input, Lispy, &res)) {
      		lval* x = lval_eval(lval_read(res.output));
      		//mpc_ast_print(res.output);
      		lval_println(x);
      		lval_del(x);
      		mpc_ast_delete(res.output);
    	} else {    
      		mpc_err_print(res.error);
      		mpc_err_delete(res.error);
   		}
		
		free(input);
	}
	
	//释放树的空间 
	mpc_cleanup(6, Number, Symbol, Sexpr, Qexpr, Expr, Lispy);
	return 0; 
}
```

## 引入变量

~~~c
//枚举左值类型:错误，数值，开始符，函数，S-Expression，Q-Expression 
enum{ LVAL_ERR, LVAL_NUM, LVAL_SYM, LVAL_FUN, LVAL_SEXPR, LVAL_QEXPR };

//函数指针 
typedef lval*(*lbuiltin)(lenv*, lval*); 

struct lval{
	int type;
	long num;
	//用字符串来表示错误和符号更完整高效 
	char* err;
	char* sym;
	//函数指针  
	lbuiltin fun;
	//记录当前左值能推出的表达式数量
	int count;
	//储存表达式（类型为lval*），用lval*的指针储存，即双指针lval** 
	struct lval** cell; 
};


//函数左值构造
lval* lval_fun(lbuiltin func){
	lval* v = malloc(sizeof(lval));
	v->type = LVAL_FUN;
	v->fun = func;
	return v;
}

void lval_del(lval* v){
	
	switch(v->type){
		case LVAL_FUN: break;
		case LVAL_NUM: break;
		//释放字符指针 
		case LVAL_ERR: free(v->err); break;
		case LVAL_SYM: free(v->sym); break;
		
		//二者删除逻辑一模一样，碰到Qexpr不退出继续执行即可 
		case LVAL_QEXPR:
		case LVAL_SEXPR:{
			int i;
			//将后继表达式依次释放，递归调用lval_del
			for(i = 0; i < v->count; i++){
				lval_del(v->cell[i]);
			}
			//释放lval双指针 
			free(v->cell);
			break;
		}
		
	}
	//释放自身lval指针 
	free(v);
}


//完全copy一个左值 
lval* lval_copy(lval* v){	
  	lval* x = malloc(sizeof(lval));
  	x->type = v->type;
  
  	switch (v->type) {
    
    	//若为函数或者数字，直接copy即可 
    	case LVAL_FUN: x->fun = v->fun; break;
    	case LVAL_NUM: x->num = v->num; break;
		
		 /* Copy Strings using malloc and strcpy */
    	case LVAL_ERR:
      		x->err = malloc(strlen(v->err) + 1);
      		strcpy(x->err, v->err); break;
      
    	case LVAL_SYM:
      		x->sym = malloc(strlen(v->sym) + 1);
      		strcpy(x->sym, v->sym); break;
		
		case LVAL_SEXPR:
   		case LVAL_QEXPR:
      		x->count = v->count;
      		x->cell = malloc(sizeof(lval*) * x->count);
      		int i; 
			for (i = 0; i < x->count; i++) {
        		x->cell[i] = lval_copy(v->cell[i]);
      		}
    		break;		
	} 
	return x;
}



void lval_print(lval* v){
	switch(v->type){
		case LVAL_FUN: printf("<function>");			break;
		case LVAL_NUM: printf("%li", v->num); 			break;
		case LVAL_ERR: printf("Error: %s", v->err); 	break;
		case LVAL_SYM: printf("%s", v->sym); 			break;
		case LVAL_SEXPR: lval_expr_print(v, '(', ')'); 	break;
		case LVAL_QEXPR: lval_expr_print(v, '{', '}'); 	break;
	}
}



char* ltype_name(int t){
	switch(t){
		case LVAL_FUN: return "Function";
    	case LVAL_NUM: return "Number";
    	case LVAL_ERR: return "Error";
    	case LVAL_SYM: return "Symbol";
    	case LVAL_SEXPR: return "S-Expression";
    	case LVAL_QEXPR: return "Q-Expression";
    	default: return "Unknown";
	}
}



struct lenv{
	int count;
	char** syms;
	lval** vals;
};

//环境基本操作 
lenv* lenv_new(void){
	lenv* e = malloc(sizeof(lenv));
	e->count = 0;
	e->syms = NULL;
	e->vals = NULL;
	return e;
} 

void lenv_del(lenv* e){
	int i;
	for(i = 0; i < e->count; i++){
		//释放开始符char*
		free(e->syms[i]);
		//释放当前变量(lval*) 
		lval_del(e->vals[i]);
	}
	//释放开始符指针(char**) 
	free(e->syms);
	//释放左值指针(lval**) 
	free(e->vals);
	//释放自己(lenv*) 
	free(e);
}


lval* lenv_get(lenv* e, lval* k){
	int i;
	for(i = 0; i < e->count; i++){
		if(strcmp(e->syms[i], k->sym) == 0){
			//复制一份出来，不指向原先位置，会引起混乱 
			return lval_copy(e->vals[i]);
		}
	}
	
	return lval_err("Unfound Symbol '%s'", k->sym);
}


//添加左值v到开始符k的位置 
void lenv_put(lenv* e, lval* k, lval* v){
	int i;
	for(i = 0; i < e->count; i++){
		//如果环境e中存在k，替换k为v 
		if(strcmp(e->syms[i], k->sym) == 0){
			lval_del(e->vals[i]);
			//将k的符号处对应的左值设置为v 
			e->vals[i] = lval_copy(v);
			return;
		}
	}
	//如果k不存在于当前环境中，添加k的开始符，添加v的左值 
	e->count++;
	e->vals = realloc(e->vals, sizeof(lval*) * e->count);
	e->syms = realloc(e->syms, sizeof(char*) * e->count);
	
	e->vals[e->count-1] = lval_copy(v);
	e->syms[e->count-1] = malloc(strlen(k->sym) + 1);
	strcpy(e->syms[e->count-1], k->sym);
	
}


//宏定义断言 
//断言套断言
//...?
#define LASSERT(args, cond, fmt, ...) \
  if (!(cond)) { lval* err = lval_err(fmt, ##__VA_ARGS__); lval_del(args); return err; }

#define LASSERT_TYPE(func, args, index, expect)	\
  LASSERT(args, args->cell[index]->type == expect, \
    "Function '%s' passed incorrect number of arguments. Got %i, Expected %i.", \
	func, index, ltype_name(args->cell[index]->type), ltype_name(expect))
	
#define LASSERT_NUM(func, args, num) \
  LASSERT(args, args->count == num, \
    "Function '%s' passed incorrect number of arguments, Got %i. Expected %i.", \
	func, args->count, num);

#define LASSERT_NOT_EMPTY(func, args, index) \
  LASSERT(args, args->cell[index]->count != 0, \
    "Function '%s' passed {} for argument %i.", func, index);
    
    



//head函数，没用宏断言:删除传入左值a->cell中下标为1到最后的所有元素，即只返回cell[0] 
lval* builtin_head(lenv* e, lval* a){
	//错误检测 
	LASSERT_NUM("head", a, 1);
	LASSERT_TYPE("head", a, 0, LVAL_QEXPR);
	LASSERT_NOT_EMPTY("head", a, 0);
	
	//排除错误后取出第一个推导 
	lval* v = lval_take(a, 0);
	
	while(v->count >1){
		lval_del(lval_pop(v, 1));
	} 
	//获得最右推导 
	return v;
}


//tail函数，不用宏断言:删除传入左值a->cell中下标为0的元素，即第一个元素 
lval* builtin_tail(lenv* e, lval* a){
	//检错 
	LASSERT_NUM("tail", a, 1);
	LASSERT_TYPE("tail", a, 0, LVAL_QEXPR);
	LASSERT_NOT_EMPTY("tail", a, 0);
	
	lval* v = lval_take(a, 0);
	
	lval_del(lval_pop(v, 0));
	return v;
}
 

//eval函数，将Q-expression转换为S-expression
lval* builtin_eval(lenv* e, lval* a){
	//用宏断言处理的错误检查，若cond，则lval_del(args)并且return lval_err(err) 
	LASSERT_NUM("eval", a, 1);
	LASSERT_TYPE("eval", a, 0, LVAL_QEXPR);
	
	lval* x = lval_take(a, 0);
	x->type = LVAL_SEXPR;
	return lval_eval(e, x);
} 


//通过循环调用lval_join计算一个Q-expression表达式 
lval* builtin_join(lenv* e, lval* a){
	int i;
	//检查推导中是否含有不属于Q-expression的产生式 
	for(i = 0; i < a->count; i++){
		LASSERT_TYPE("join", a, i, LVAL_QEXPR);
	}
	
	lval* x = lval_pop(a, 0);
	while(a->count){
		//x = lval_join(x, lval_pop(a, 0));
		lval* y = lval_pop(a, 0);
		x = lval_join(x, y);
	}
	
	lval_del(a);
	return x;
} 


//数的计算 
lval* builtin_op(lenv* e, lval* a, char* op){
	int i;
	for(i = 0; i < a->count; i++){
		LASSERT_TYPE(op, a, i, LVAL_NUM);
	}
	
	//开始弹栈，进行计算 
	lval* x = lval_pop(a, 0);
	if((strcmp(op, "-") == 0) && a->count == 0){
		x->num = -x->num;
	}
	
	//因为已经由语法树构造好了计算顺序，已经考虑过了优先级问题 
	//尾递归的循环 
	while(a->count > 0){
		lval* y = lval_pop(a, 0);
		
		if(strcmp(op, "+") == 0){ x->num += y->num; }
		if(strcmp(op, "-") == 0){ x->num -= y->num; }
		if(strcmp(op, "*") == 0){ x->num *= y->num; }
		if(strcmp(op, "/") == 0){
			if(y->num == 0){
				//释放空间 
				lval_del(x);
				lval_del(y);
				x = lval_err("Division By Zero.");
				break;
			}
			x->num /= y->num;
		}
		lval_del(y);
	}
	
	lval_del(a);
	return x;
}

lval* builtin_add(lenv* e, lval* a){
	return builtin_op(e, a, "+");
}

lval* builtin_sub(lenv* e, lval* a){
	return builtin_op(e, a, "-");
}

lval* builtin_mul(lenv* e, lval* a){
	return builtin_op(e, a, "*");
}

lval* builtin_div(lenv* e, lval* a){
	return builtin_op(e, a, "/");
}
 
//我想加一个清屏功能 
void builtin_cls(lenv* e, lval* v){
	system("cls");
}

void lenv_add_builtin(lenv* e, char* name, lbuiltin func){
	lval* k = lval_sym(name);
	lval* v = lval_fun(func);
	lenv_put(e, k, v);
	lval_del(k);
	lval_del(v);
}


void lenv_add_builtins(lenv* e){
	
	lenv_add_builtin(e, "def", builtin_def);
	
	
	lenv_add_builtin(e, "list", builtin_list);
	lenv_add_builtin(e, "head", builtin_head);
	lenv_add_builtin(e, "tail", builtin_tail);
	lenv_add_builtin(e, "eval", builtin_eval);
	lenv_add_builtin(e, "join", builtin_join);
	
	lenv_add_builtin(e, "+", builtin_add);
	lenv_add_builtin(e, "-", builtin_sub);
	lenv_add_builtin(e, "*", builtin_mul);
	lenv_add_builtin(e, "/", builtin_div);
}
~~~

main

```c
int main(int argc, char** argv){
	
	//定义新的文法 
	mpc_parser_t* Number = mpc_new("number");	
	mpc_parser_t* Symbol = mpc_new("symbol");	
	mpc_parser_t* Sexpr = mpc_new("sexpr");
	mpc_parser_t* Qexpr = mpc_new("qexpr");	
	mpc_parser_t* Expr = mpc_new("expr");	
	mpc_parser_t* Lispy = mpc_new("lispy");				
	mpca_lang(MPCA_LANG_DEFAULT,
		"															\
			number: /-?[0-9]+/;										\
			symbol: /[a-zA-Z0-9_+\\-*\\/\\\\=<>!&]+/;				\
			sexpr: '(' <expr>* ')';									\
			qexpr: '{' <expr>* '}';									\
			expr: <number> | <symbol> | <sexpr> | <qexpr>;			\
			lispy: /^/ <expr>* /$/;									\
		",
		Number, Symbol, Sexpr, Qexpr, Expr, Lispy
	);
	
	puts("Lispy Version 0.7\nPress Ctrl+c to Exit\n");
	
	lenv* e = lenv_new();
	lenv_add_builtins(e);
	
	while(1){
		char* input = readLine("lispy> ");
		add_history(input);
		
		mpc_result_t res;
		if (mpc_parse("<stdin>", input, Lispy, &res)) {
      		lval* x = lval_eval(e, lval_read(res.output));
      		//mpc_ast_print(res.output);
      		lval_println(x);
      		lval_del(x);
      		mpc_ast_delete(res.output);
    	} else {    
      		mpc_err_print(res.error);
      		mpc_err_delete(res.error);
   		}
		
		free(input);
	}
	
	lenv_del(e);
	//释放树的空间 
	mpc_cleanup(6, Number, Symbol, Sexpr, Qexpr, Expr, Lispy);
	return 0; 
}
```

## 实现函数

> 内建函数 built_in
>
> 通过内建函数 def 实现用户自定义函数

~~~c
struct lval{
	//种类、数值 
	int type;
	long num;
	//用字符串来表示错误和符号更完整高效 
	char* err;
	char* sym;
	
	//函数指针:内建函数 
	lbuiltin builtin;
	//用户自定义函数
	lenv* env; 
	lval* formals;
	lval* body;
	
	
	//记录当前左值能推出的表达式数量
	int count;
	//储存表达式（类型为lval*），用lval*的指针储存，即双指针lval** 
	struct lval** cell; 
};


//函数左值构造
lval* lval_fun(lbuiltin builtin){
	lval* v = malloc(sizeof(lval));
	v->type = LVAL_FUN;
	v->builtin = builtin;
	return v;
} 

lenv* lenv_new();
lval* lval_lambda(lval* formals, lval* body){
	lval* v = malloc(sizeof(lval));
	v->type = LVAL_FUN;
	
	v->builtin = NULL;
	v->env = lenv_new();
	
	v->formals = formals;
	v->body = body;
	return v;
}


void lenv_del(lenv* v);
void lval_del(lval* v){
	
	switch(v->type){
		case LVAL_FUN:{
			if(!v->builtin){
				lenv_del(v->env);
				lval_del(v->formals);
				lval_del(v->body);
			} 
			break;
		}
		case LVAL_NUM: break;
		//释放字符指针 
		case LVAL_ERR: free(v->err); break;
		case LVAL_SYM: free(v->sym); break;
		
		//二者删除逻辑一模一样，碰到Qexpr不退出继续执行即可 
		case LVAL_QEXPR:
		case LVAL_SEXPR:{
			int i;
			//将后继表达式依次释放，递归调用lval_del
			for(i = 0; i < v->count; i++){
				lval_del(v->cell[i]);
			}
			//释放lval双指针 
			free(v->cell);
			break;
		}
		
	}
	//释放自身lval指针 
	free(v);
}


lenv* lenv_copy(lenv* e);
//完全copy一个左值 
lval* lval_copy(lval* v){	
  	lval* x = malloc(sizeof(lval));
  	x->type = v->type;
  
  	switch (v->type) {
    
    	//若为函数或者数字，直接copy即可 
    	case LVAL_FUN: {
    		if(!v->builtin){
    			x->builtin = NULL;
    			x->env = lenv_copy(v->env);
    			x->formals = lval_copy(v->formals);
    			x->body = lval_copy(v->body);
			} else {
				x->builtin = v->builtin;
			}
			break;
		}
    	case LVAL_NUM: x->num = v->num; break;
		
		 /* Copy Strings using malloc and strcpy */
    	case LVAL_ERR:
      		x->err = malloc(strlen(v->err) + 1);
      		strcpy(x->err, v->err); break;
      
    	case LVAL_SYM:
      		x->sym = malloc(strlen(v->sym) + 1);
      		strcpy(x->sym, v->sym); break;
		
		case LVAL_SEXPR:
   		case LVAL_QEXPR:
      		x->count = v->count;
      		x->cell = malloc(sizeof(lval*) * x->count);
      		int i; 
			for (i = 0; i < x->count; i++) {
        		x->cell[i] = lval_copy(v->cell[i]);
      		}
    		break;		
	} 
	return x;
}


//打印 
void lval_print(lval* v){
	switch(v->type){
		case LVAL_FUN:{
			//若为内建函数 
			if(v->builtin){
				printf("<builtin>");
			} else {	//若为用户自定义函数 
				printf("(\\ ");
				lval_print(v->formals);
				putchar(' ');
				lval_print(v->body);
				putchar(')'); 
			}
			break;
		} 
		
		case LVAL_NUM: printf("%li", v->num); 			break;
		case LVAL_ERR: printf("Error: %s", v->err); 	break;
		case LVAL_SYM: printf("%s", v->sym); 			break;
		case LVAL_SEXPR: lval_expr_print(v, '(', ')'); 	break;
		case LVAL_QEXPR: lval_expr_print(v, '{', '}'); 	break;
	}
}




char* ltype_name(int t){
	switch(t){
		case LVAL_FUN: return "Function";
    	case LVAL_NUM: return "Number";
    	case LVAL_ERR: return "Error";
    	case LVAL_SYM: return "Symbol";
    	case LVAL_SEXPR: return "S-Expression";
    	case LVAL_QEXPR: return "Q-Expression";
    	default: return "Unknown";
	}
}



struct lenv{
	lenv* par;
	int count;
	char** syms;
	lval** vals;
};
//环境基本操作 
lenv* lenv_new(){
	lenv* e = malloc(sizeof(lenv));
	e->par = NULL;
	e->count = 0;
	e->syms = NULL;
	e->vals = NULL;
	return e;
} 


void lenv_del(lenv* e){
	int i;
	for(i = 0; i < e->count; i++){
		//释放开始符char*
		free(e->syms[i]);
		//释放当前变量(lval*) 
		lval_del(e->vals[i]);
	}
	//释放开始符指针(char**) 
	free(e->syms);
	//释放左值指针(lval**) 
	free(e->vals);
	//释放自己(lenv*) 
	free(e);
}



lenv* lenv_copy(lenv* e){
	lenv* x = malloc(sizeof(lenv));
	x->par = e->par;
	x->count = e->count;
	
	x->syms = malloc(sizeof(char*) * x->count);
	x->vals = malloc(sizeof(lval*) * x->count);
	
	int i;
	for(i = 0; i < x->count; i++){
		x->syms[i] = malloc(strlen(e->syms[i]) + 1);
		strcpy(x->syms[i], e->syms[i]);
		x->vals[i] = lval_copy(e->vals[i]);
	}
	
	return x;
}

lval* lenv_get(lenv* e, lval* k){
	int i;
	for(i = 0; i < e->count; i++){
		if(strcmp(e->syms[i], k->sym) == 0){
			//复制一份出来，不指向原先位置，会引起混乱 
			return lval_copy(e->vals[i]);
		}
	}
	
	//寻找父类环境中的函数 
	if(e->par){
		return lenv_get(e->par, k); 
	}
	
	return lval_err("undefine symbol '%s'.", k->sym);
}


//在环境e中添加左值v到开始符k的位置 
void lenv_put(lenv* e, lval* k, lval* v){
	int i;
	for(i = 0; i < e->count; i++){
		//如果环境e中存在k，替换k为v 
		if(strcmp(e->syms[i], k->sym) == 0){
			lval_del(e->vals[i]);
			//将k的符号处对应的左值设置为v 
			e->vals[i] = lval_copy(v);
			return;
		}
	}
	//如果k不存在于当前环境中，添加k的开始符，添加v的左值 
	e->count++;
	e->vals = realloc(e->vals, sizeof(lval*) * e->count);
	e->syms = realloc(e->syms, sizeof(char*) * e->count);
	
	e->vals[e->count-1] = lval_copy(v);
	e->syms[e->count-1] = malloc(strlen(k->sym) + 1);
	strcpy(e->syms[e->count-1], k->sym);
	
}



void lenv_def(lenv* e, lval* k, lval* v){
	
	while(e->par){
		e = e->par;
	}
	
	lenv_put(e, k, v);
}


//宏定义断言 
//断言套断言
//...?
#define LASSERT(args, cond, fmt, ...) \
  if (cond) { lval* err = lval_err(fmt, ##__VA_ARGS__); lval_del(args); return err; }

#define LASSERT_TYPE(func, args, index, expect)	\
  LASSERT(args, args->cell[index]->type != expect, \
    "Function '%s' passed incorrect number of arguments. Got %i, Expected %i.", \
	func, index, ltype_name(args->cell[index]->type), ltype_name(expect))
	
#define LASSERT_NUM(func, args, num) \
  LASSERT(args, args->count != num, \
    "Function '%s' passed incorrect number of arguments, Got %i. Expected %i.", \
	func, args->count, num);

#define LASSERT_NOT_EMPTY(func, args, index) \
  LASSERT(args, args->cell[index]->count == 0, \
    "Function '%s' passed {} for argument %i.", func, index);
    
    
//lval_eval函数:其功能是，若a->type==SEXPR，
//则返回S-expression表达式处理结果，否则直接返回a
lval* lval_eval(lenv* e, lval* v);


//内建lambda函数 
lval* builtin_lambda(lenv* e, lval* a){
	LASSERT_NUM("\\", a, 2);   
	LASSERT_TYPE("\\", a, 0, LVAL_QEXPR);
	LASSERT_TYPE("\\", a, 1, LVAL_QEXPR);
	
	int i;
	for(i = 0; i < a->cell[0]->count; i++){
		LASSERT(a, (a->cell[0]->cell[i]->type != LVAL_SYM),
			"Cannot define non-symbol. Got %s, Expected %s.",
			ltype_name(a->cell[0]->cell[i]->type), ltype_name(LVAL_SYM));
	}
	
	lval* formals = lval_pop(a, 0);
	lval* body = lval_pop(a, 0);
	lval_del(a);
	
	return lval_lambda(formals, body); 
} 


//内建函数，加入环境支持
//list函数，将S-expression转换为Q-expression 
lval* builtin_list(lenv* e, lval* a){
	a->type = LVAL_QEXPR;
	return a;
} 


//head函数，没用宏断言:删除传入左值a->cell中下标为1到最后的所有元素，即只返回cell[0] 
lval* builtin_head(lenv* e, lval* a){
	//错误检测 
	LASSERT_NUM("head", a, 1);
	LASSERT_TYPE("head", a, 0, LVAL_QEXPR);
	LASSERT_NOT_EMPTY("head", a, 0);
	
	//排除错误后取出第一个推导 
	lval* v = lval_take(a, 0);
	
	while(v->count >1){
		lval_del(lval_pop(v, 1));
	} 
	//获得最右推导 
	return v;
}


//tail函数，不用宏断言:删除传入左值a->cell中下标为0的元素，即第一个元素 
lval* builtin_tail(lenv* e, lval* a){
	//检错 
	LASSERT_NUM("tail", a, 1);
	LASSERT_TYPE("tail", a, 0, LVAL_QEXPR);
	LASSERT_NOT_EMPTY("tail", a, 0);
	
	lval* v = lval_take(a, 0);
	
	lval_del(lval_pop(v, 0));
	return v;
}
 

//eval函数，将Q-expression转换为S-expression
lval* builtin_eval(lenv* e, lval* a){
	//用宏断言处理的错误检查，若cond，则lval_del(args)并且return lval_err(err) 
	LASSERT_NUM("eval", a, 1);
	LASSERT_TYPE("eval", a, 0, LVAL_QEXPR);
	
	lval* x = lval_take(a, 0);
	x->type = LVAL_SEXPR;
	return lval_eval(e, x);
} 


//通过循环调用lval_join计算一个Q-expression表达式 
lval* builtin_join(lenv* e, lval* a){
	int i;
	//检查推导中是否含有不属于Q-expression的产生式 
	for(i = 0; i < a->count; i++){
		LASSERT_TYPE("join", a, i, LVAL_QEXPR);
	}
	
	lval* x = lval_pop(a, 0);
	while(a->count){
		//x = lval_join(x, lval_pop(a, 0));
		lval* y = lval_pop(a, 0);
		x = lval_join(x, y);
	}
	
	lval_del(a);
	return x;
} 


//数的计算 
lval* builtin_op(lenv* e, lval* a, char* op){
	int i;
	for(i = 0; i < a->count; i++){
		LASSERT_TYPE(op, a, i, LVAL_NUM);
	}
	
	//开始弹栈，进行计算 
	lval* x = lval_pop(a, 0);
	if((strcmp(op, "-") == 0) && a->count == 0){
		x->num = -x->num;
	}
	
	//因为已经由语法树构造好了计算顺序，已经考虑过了优先级问题 
	//尾递归的循环 
	while(a->count > 0){
		lval* y = lval_pop(a, 0);
		
		if(strcmp(op, "+") == 0){ x->num += y->num; }
		if(strcmp(op, "-") == 0){ x->num -= y->num; }
		if(strcmp(op, "*") == 0){ x->num *= y->num; }
		if(strcmp(op, "/") == 0){
			if(y->num == 0){
				//释放空间 
				lval_del(x);
				lval_del(y);
				x = lval_err("Division By Zero.");
				break;
			}
			x->num /= y->num;
		}
		lval_del(y);
	}
	
	lval_del(a);
	return x;
}

lval* builtin_add(lenv* e, lval* a){ return builtin_op(e, a, "+"); }

lval* builtin_sub(lenv* e, lval* a){ return builtin_op(e, a, "-"); }

lval* builtin_mul(lenv* e, lval* a){ return builtin_op(e, a, "*"); }

lval* builtin_div(lenv* e, lval* a){ return builtin_op(e, a, "/"); }




lval* builtin_var(lenv* e, lval* a, char* func){
	LASSERT_TYPE(func, a, 0, LVAL_QEXPR);
	
	lval* syms = a->cell[0];
	int i;
	for(i = 0; i < syms->count; i++){
		LASSERT(a, (syms->cell[i]->type != LVAL_SYM), 
			"Function '%s' cannot define non-symbol. "
			"Got %i, Expected %i.", 
			func, ltype_name(syms->cell[i]->type), ltype_name(LVAL_SYM));
	}
	
	LASSERT(a, (syms->count != a->count-1), 
		"Function '%s' passed too many arguments for symbols. "
		"Got %i, Expected %i.",
		func, syms->count, a->count-1);
	
	for(i = 0; i < syms->count; i++){
		if(strcmp(func, "def") == 0){
			lenv_def(e, syms->cell[i], a->cell[i+1]);
		}
		
		if(strcmp(func, "=") == 0){
			lenv_put(e, syms->cell[i], a->cell[i+1]);
		}
	}
	
	lval_del(a);
	return lval_sexpr();
}

lval* builtin_def(lenv* e, lval* a){
	return builtin_var(e, a, "def");
}


lval* builtin_put(lenv* e, lval* a){
	return builtin_var(e, a, "=");
}


//我想加一个清屏功能 
void builtin_clear(lenv* e, lval* v){
	system("cls");
}


void lenv_add_builtin(lenv* e, char* name, lbuiltin func){
	lval* k = lval_sym(name);
	lval* v = lval_fun(func);
	lenv_put(e, k, v);
	lval_del(k);
	lval_del(v);
}


void lenv_add_builtins(lenv* e){
	
	lenv_add_builtin(e, "\\", builtin_lambda);
	lenv_add_builtin(e, "def", builtin_def);
	lenv_add_builtin(e, "=", builtin_put);
	
	lenv_add_builtin(e, "list", builtin_list);
	lenv_add_builtin(e, "head", builtin_head);
	lenv_add_builtin(e, "tail", builtin_tail);
	lenv_add_builtin(e, "eval", builtin_eval);
	lenv_add_builtin(e, "join", builtin_join);
	
	lenv_add_builtin(e, "+", builtin_add);
	lenv_add_builtin(e, "-", builtin_sub);
	lenv_add_builtin(e, "*", builtin_mul);
	lenv_add_builtin(e, "/", builtin_div);
}


lval* lval_call(lenv* e, lval* f, lval* a){
	
	if(f->builtin){ return f->builtin(e, a); }
	
	int given = a->count;
	int total = f->formals->count;
	
	while(a->count > 0){
		if(f->formals->count == 0){
			lval_del(a);
			return lval_err("Function passed too many arguments. "
				"Got %i, Expected %i.", given, total);
		}
		
		lval* sym = lval_pop(f->formals, 0);
		
		if(strcmp(sym->sym, "&") == 0){
			if(f->formals->count != 1){
				lval_del(a);
				return lval_err("Function format invalid. "
					"Symbol '&' not followed by single symbol.");
			}
			lval* nsym = lval_pop(f->formals, 0);
			lenv_put(f->env,nsym, builtin_list(e, a));
			lval_del(sym);
			lval_del(nsym);
			break;
		}
	
		lval* val = lval_pop(a, 0);
		
		lenv_put(f->env, sym, val);
		
		lval_del(sym);
		lval_del(val); 
	}
	
	lval_del(a);
	
	if(f->formals->count > 0 &&
		strcmp(f->formals->cell[0]->sym, "&") == 0){
		
		if(f->formals->count != 2){
			return lval_err("Function format invalid. "
				"Symbol '&' not followed by single symbol.");
		}
		
		lval_del(lval_pop(f->formals, 0));
		
		lval* sym = lval_pop(f->formals, 0);
		lval* val = lval_qexpr();
		
		lenv_put(f->env, sym, val);
		lval_del(sym);
		lval_del(val);
	}
	
	if(f->formals->count == 0){
		
		f->env->par = e;
		
		return builtin_eval(f->env,
			lval_add(lval_sexpr(), lval_copy(f->body)));
	}
	
	return lval_copy(f);
} 

//计算S-expression表达式的结果
lval* lval_eval_sexpr(lenv* e, lval* v){
	//计算相邻子节点的合并 
	int i;
	for(i = 0; i < v->count; i++){
		v->cell[i] = lval_eval(e, v->cell[i]);
	}
	for(i = 0; i < v->count; i++){
		if(v->cell[i]->type == LVAL_ERR){
			return lval_take(v, i);
		}
	}
	
	if(v->count == 0)	return v;
	if(v->count == 1)	return lval_take(v, 0);
	
	lval* f = lval_pop(v, 0);
	if(f->type != LVAL_FUN){
		lval* err = lval_err(
		  "S-expression starts with incorrect type. "
		  "Got %s, Expected %s.",
		  ltype_name(f->type), ltype_name(LVAL_FUN)
		);
		
		lval_del(f);
		lval_del(v);
		return err;
	}
	
	//调用内建函数在环境v处理最终推导左值v 
	lval* result = lval_call(e, f, v);
	lval_del(f);
	return result;
}



lval* lval_eval(lenv* e, lval* v){
	if(v->type == LVAL_SYM){
		lval* x = lenv_get(e, v);
		lval_del(v);
		return x;
	}
	if(v->type == LVAL_SEXPR){
		return lval_eval_sexpr(e, v);
	}
	return v;
}


//将语法树的数字部分转换为token返回 
lval* lval_read_num(mpc_ast_t* t){
	errno = 0;
	//strtol:将字符串转换为长整型，第二个参数为指向不可转换的char*的位置(即在此处停止转换)，10为进制 
	long x = strtol(t->contents, NULL, 10);
	return errno != ERANGE ?
		lval_num(x): lval_err("Invalid number."); 
}


//将生成的抽象语法树转化为s-expression表达式 
lval* lval_read(mpc_ast_t* t){
	//strstr:匹配两字符串 
	if(strstr(t->tag, "number"))	return lval_read_num(t);
	if(strstr(t->tag, "symbol"))	return lval_sym(t->contents);
	
	lval* x = NULL;
	//strcmp:比较两字符串，返回字符串(大小)str1-str2，当为0二者相同 
	if(strcmp(t->tag, ">") == 0 || strstr(t->tag, "sexpr")){
		x = lval_sexpr();
	}
	if(strstr(t->tag, "qexpr")){
		x = lval_qexpr();
	}
	
	int i;
	for(i = 0; i< t->children_num; i++){
		if(strcmp(t->children[i]->contents, "(") == 0
			|| strcmp(t->children[i]->contents, ")") == 0
			|| strcmp(t->children[i]->contents, "{") == 0
			|| strcmp(t->children[i]->contents, "}") == 0
			|| strcmp(t->children[i]->tag, "regex") == 0)
			{
			continue;
		}
		x = lval_add(x, lval_read(t->children[i]));
	}		
	return x;
}


 
int main(int argc, char** argv){
	
	//定义新的文法 
	mpc_parser_t* Number = mpc_new("number");	
	mpc_parser_t* Symbol = mpc_new("symbol");	
	mpc_parser_t* Sexpr = mpc_new("sexpr");
	mpc_parser_t* Qexpr = mpc_new("qexpr");	
	mpc_parser_t* Expr = mpc_new("expr");	
	mpc_parser_t* Lispy = mpc_new("lispy");				
	mpca_lang(MPCA_LANG_DEFAULT,
		"															\
			number: /-?[0-9]+/;										\
			symbol: /[a-zA-Z0-9_+\\-*\\/\\\\=<>!&]+/;				\
			sexpr: '(' <expr>* ')';									\
			qexpr: '{' <expr>* '}';									\
			expr: <number> | <symbol> | <sexpr> | <qexpr>;			\
			lispy: /^/ <expr>* /$/;									\
		",
		Number, Symbol, Sexpr, Qexpr, Expr, Lispy
	);
	
	puts("Lispy Version 0.8\nPress Ctrl+c to Exit\n");
	
	lenv* e = lenv_new();
	lenv_add_builtins(e);
	
	while(1){
		char* input = readLine("lispy> ");
		add_history(input);
		
		mpc_result_t res;
		if (mpc_parse("<stdin>", input, Lispy, &res)) {
      		lval* x = lval_eval(e, lval_read(res.output));
      		//mpc_ast_print(res.output);
      		lval_println(x);
      		lval_del(x);
      		mpc_ast_delete(res.output);
    	} else {    
      		mpc_err_print(res.error);
      		mpc_err_delete(res.error);
   		}
		
		free(input);
	}
	
	lenv_del(e);
	//释放树的空间 
	mpc_cleanup(6, Number, Symbol, Sexpr, Qexpr, Expr, Lispy);
	return 0; 
}
~~~

## 实现条件判断

实现了内建函数 if 以及一些比较函数

~~~c
//宏定义断言 
//断言套断言
//...?
#define LASSERT(args, cond, fmt, ...) \
  if (cond) { lval* err = lval_err(fmt, ##__VA_ARGS__); lval_del(args); return err; }

#define LASSERT_TYPE(func, args, index, expect)	\
  LASSERT(args, args->cell[index]->type != expect, \
    "Function '%s' passed incorrect number of arguments. Got %i, Expected %i.", \
	func, index, ltype_name(args->cell[index]->type), ltype_name(expect))
	
#define LASSERT_NUM(func, args, num) \
  LASSERT(args, args->count != num, \
    "Function '%s' passed incorrect number of arguments, Got %i. Expected %i.", \
	func, args->count, num);

#define LASSERT_NOT_EMPTY(func, args, index) \
  LASSERT(args, args->cell[index]->count == 0, \
    "Function '%s' passed {} for argument %i.", func, index);
    
    
//lval_eval函数:其功能是，若a->type==SEXPR，
//则返回S-expression表达式处理结果，否则直接返回a
lval* lval_eval(lenv* e, lval* v);



lval* builtin_if(lenv* e, lval* a){
	LASSERT_NUM("if", a, 3);
	LASSERT_TYPE("if", a, 0, LVAL_NUM);
	LASSERT_TYPE("if", a, 1, LVAL_QEXPR);
	LASSERT_TYPE("if", a, 2, LVAL_QEXPR);
	
	lval* x;
	a->cell[1]->type = LVAL_SEXPR;
	a->cell[2]->type = LVAL_SEXPR;
	
	if(a->cell[0]->num){
		x = lval_eval(e, lval_pop(a, 1));
	} else {
		x = lval_eval(e, lval_pop(a, 2));
	}
	
	lval_del(a);
	return x;
}


//在环境中注册内建函数 
void lenv_add_builtins(lenv* e){
	
	lenv_add_builtin(e, "clear", builtin_cls);
	
	lenv_add_builtin(e, "if", builtin_if);
	lenv_add_builtin(e, "==", builtin_eq);
	lenv_add_builtin(e, "!=", builtin_nq);
	
	lenv_add_builtin(e, ">", builtin_gt);
	lenv_add_builtin(e, "<", builtin_lt);
	lenv_add_builtin(e, ">=", builtin_ge);
	lenv_add_builtin(e, "<=", builtin_le);
	
	lenv_add_builtin(e, "\\", builtin_lambda);
	lenv_add_builtin(e, "def", builtin_def);
	lenv_add_builtin(e, "=", builtin_put);
	
	lenv_add_builtin(e, "list", builtin_list);
	lenv_add_builtin(e, "head", builtin_head);
	lenv_add_builtin(e, "tail", builtin_tail);
	lenv_add_builtin(e, "eval", builtin_eval);
	lenv_add_builtin(e, "join", builtin_join);
	
	lenv_add_builtin(e, "+", builtin_add);
	lenv_add_builtin(e, "-", builtin_sub);
	lenv_add_builtin(e, "*", builtin_mul);
	lenv_add_builtin(e, "/", builtin_div);
}


lval* lval_call(lenv* e, lval* f, lval* a){
	
	//printf("hahaha");
	if(f->builtin){ return f->builtin(e, a); }
	
	int given = a->count;
	int total = f->formals->count;
	
	while(a->count > 0){
		if(f->formals->count == 0){
			lval_del(a);
			return lval_err("Function passed too many arguments. "
				"Got %i, Expected %i.", given, total);
		}
		
		lval* sym = lval_pop(f->formals, 0);
		
		if(strcmp(sym->sym, "&") == 0){
			if(f->formals->count != 1){
				lval_del(a);
				return lval_err("Function format invalid. "
					"Symbol '&' not followed by single symbol.");
			}
			lval* nsym = lval_pop(f->formals, 0);
			lenv_put(f->env,nsym, builtin_list(e, a));
			lval_del(sym);
			lval_del(nsym);
			break;
		}
	
		lval* val = lval_pop(a, 0);
		
		lenv_put(f->env, sym, val);
		
		lval_del(sym);
		lval_del(val); 
	}
	
	lval_del(a);
	
	if(f->formals->count > 0 &&
		strcmp(f->formals->cell[0]->sym, "&") == 0){
		
		if(f->formals->count != 2){
			return lval_err("Function format invalid. "
				"Symbol '&' not followed by single symbol.");
		}
		
		lval_del(lval_pop(f->formals, 0));
		
		lval* sym = lval_pop(f->formals, 0);
		lval* val = lval_qexpr();
		
		lenv_put(f->env, sym, val);
		lval_del(sym);
		lval_del(val);
	}
	
	if(f->formals->count == 0){
		
		f->env->par = e;
		
		return builtin_eval(f->env,
			lval_add(lval_sexpr(), lval_copy(f->body)));
	}
	
	return lval_copy(f);
} 
~~~

main

```c
int main(int argc, char** argv){
	
	//定义新的文法 
	mpc_parser_t* Number = mpc_new("number");	
	mpc_parser_t* Symbol = mpc_new("symbol");	
	mpc_parser_t* Sexpr = mpc_new("sexpr");
	mpc_parser_t* Qexpr = mpc_new("qexpr");	
	mpc_parser_t* Expr = mpc_new("expr");	
	mpc_parser_t* Lispy = mpc_new("lispy");				
	mpca_lang(MPCA_LANG_DEFAULT,
		"															\
			number: /-?[0-9]+/;										\
			symbol: /[a-zA-Z0-9_+\\-*\\/\\\\=<>!&]+/;				\
			sexpr: '(' <expr>* ')';									\
			qexpr: '{' <expr>* '}';									\
			expr: <number> | <symbol> | <sexpr> | <qexpr>;			\
			lispy: /^/ <expr>* /$/;									\
		",
		Number, Symbol, Sexpr, Qexpr, Expr, Lispy
	);
	
	puts("Lispy Version 0.9\nPress Ctrl+c to Exit\n");
	
	lenv* e = lenv_new();
	lenv_add_builtins(e);
	
	while(1){
		char* input = readLine("lispy> ");
		add_history(input);
		
		mpc_result_t res;
		if (mpc_parse("<stdin>", input, Lispy, &res)) {
      		lval* x = lval_eval(e, lval_read(res.output));
      		//mpc_ast_print(res.output);
      		lval_print(x);
      		lval_del(x);
      		mpc_ast_delete(res.output);
    	} else {    
      		mpc_err_print(res.error);
      		mpc_err_delete(res.error);
   		}
		
		free(input);
	}
	
	lenv_del(e);
	//释放树的空间 
	mpc_cleanup(6, Number, Symbol, Sexpr, Qexpr, Expr, Lispy);
	return 0; 
}
```

## 实现字符串识别和文件读入

实现了字符串的识别以及从同目录下读取文件

~~~c
//全局定义文法，用于加载文件 
mpc_parser_t* Number;	
mpc_parser_t* Symbol;
mpc_parser_t* String;
mpc_parser_t* Comment;	
mpc_parser_t* Sexpr;
mpc_parser_t* Qexpr;	
mpc_parser_t* Expr;	
mpc_parser_t* Lispy;	


//枚举左值类型:错误，数值，开始符，函数，S-Expression，Q-Expression 
enum{ LVAL_ERR, LVAL_NUM, LVAL_SYM, LVAL_STR,
	  LVAL_FUN, LVAL_SEXPR, LVAL_QEXPR };

//函数指针 
typedef lval*(*lbuiltin)(lenv*, lval*); 

struct lval{
	//左值种类 
	int type;
	//整数数值 
	long num;
	//用字符串来表示错误和标识符更完整高效 
	char* err;
	char* sym;
	
	//字符串
	char* str; 
	
	
	//函数指针:内建函数 
	lbuiltin builtin;
	//用户自定义函数
	lenv* env; 
	lval* formals;
	lval* body;
	 
	
	//记录当前左值能推出的表达式数量
	int count;
	//储存表达式（类型为lval*），用lval*的指针储存，即双指针lval** 
	struct lval** cell; 
};


lval* lval_str(char* s){
	lval* v = malloc(sizeof(lval));
	v->type = LVAL_STR;
	v->str = malloc(strlen(s) + 1);
	strcpy(v->str, s);
	return v;
}

void lval_del(lval* v){
	
	switch(v->type){
		case LVAL_FUN:{
			if(!v->builtin){
				lenv_del(v->env);
				lval_del(v->formals);
				lval_del(v->body);
			} 
			break;
		}
		//清除函数和整数左值直接退出即可 
		case LVAL_NUM: break;
		//释放字符指针 
		case LVAL_ERR: free(v->err); break;
		case LVAL_SYM: free(v->sym); break;
		
		//字符串
		case LVAL_STR: free(v->str); break;
		 
		//二者删除逻辑一模一样，碰到Qexpr不退出继续执行即可 
		case LVAL_QEXPR:
		case LVAL_SEXPR:{
			int i;
			//将后继表达式依次释放，递归调用lval_del
			for(i = 0; i < v->count; i++){
				lval_del(v->cell[i]);
			}
			//释放lval双指针 
			free(v->cell);
			break;
		}
		
	}
	//释放自身lval指针 
	free(v);
}


//完全copy一个左值 
lval* lval_copy(lval* v){	
  	lval* x = malloc(sizeof(lval));
  	x->type = v->type;
  
  	switch (v->type) {
    
    	//若为字符串，copy字符串 
		case LVAL_STR:{
			x->str = malloc(strlen(v->str) + 1);
			strcpy(x->str, v->str);
			break;
		} 

    	//若为函数或者数字，copy其值 
    	case LVAL_FUN: {
    		if(!v->builtin){
    			x->builtin = NULL;
    			x->env = lenv_copy(v->env);
    			x->formals = lval_copy(v->formals);
    			x->body = lval_copy(v->body);
			} else {
				x->builtin = v->builtin;
			}
			break;
		}
    	case LVAL_NUM: x->num = v->num; break;
		
		 /* Copy Strings using malloc and strcpy */
    	case LVAL_ERR:
      		x->err = malloc(strlen(v->err) + 1);
      		strcpy(x->err, v->err); break;
      
    	case LVAL_SYM:
      		x->sym = malloc(strlen(v->sym) + 1);
      		strcpy(x->sym, v->sym); break;
		
		case LVAL_SEXPR:
   		case LVAL_QEXPR:
      		x->count = v->count;
      		x->cell = malloc(sizeof(lval*) * x->count);
      		int i; 
			for (i = 0; i < x->count; i++) {
        		x->cell[i] = lval_copy(v->cell[i]);
      		}
    		break;		
	} 
	return x;
}



//打印左值字符串 
void lval_str_print(lval* v){
	char* escaped = malloc(strlen(v->str) + 1);
	strcpy(escaped, v->str);
	
	//字符指针转字符串 
	escaped = mpcf_escape(escaped);
	printf("\"%s\"", escaped);
	free(escaped);
}


lval* builtin_cls(lenv* e, lval* v);
void lval_print(lval* v){
	switch(v->type){
		
		case LVAL_STR: lval_str_print(v); break;

		
		case LVAL_FUN:{
			//若为内建函数 
			if(v->builtin){
				if(v->builtin == builtin_cls){
					system("cls");
					break;
				} 
				printf("<builtin>");
			} else {	//若为用户自定义函数 
				printf("(\\ ");
				lval_print(v->formals);
				putchar(' ');
				lval_print(v->body);
				putchar(')'); 
			}
			break;
		} 
		
		case LVAL_NUM: printf("%li", v->num);			break;
		case LVAL_ERR: printf("Error: %s", v->err); 	break;
		case LVAL_SYM: printf("%s", v->sym); 			break;
		case LVAL_SEXPR: lval_expr_print(v, '(', ')'); 	break;
		case LVAL_QEXPR: lval_expr_print(v, '{', '}'); 	break;
	
	}
}



char* ltype_name(int t){
	switch(t){
		case LVAL_STR: return "String"; 
		case LVAL_FUN: return "Function";
    	case LVAL_NUM: return "Number";
    	case LVAL_ERR: return "Error";
    	case LVAL_SYM: return "Symbol";
    	case LVAL_SEXPR: return "S-Expression";
    	case LVAL_QEXPR: return "Q-Expression";
    	default: return "Unknown";
	}
}


//我想加一个清屏功能 
lval* builtin_cls(lenv* e, lval* a){
	LASSERT_NUM("cls", a, 1);	
	LASSERT_TYPE("cls", a, 0, LVAL_SYM);
	
	return lval_sexpr();
}


lval* lval_read(mpc_ast_t* t);
lval* builtin_load(lenv* e, lval* a){
	LASSERT_NUM("load", a, 1);
	LASSERT_TYPE("load", a, 0, LVAL_STR);
	
	mpc_result_t r;
	if(mpc_parse_contents(a->cell[0]->str, Lispy, &r)){
		lval* expr = lvalread(r.output);
		mpc_ast_delete(r.output);
		
		while(expr->count){
			lval* x = lval_eval(e, lval_pop(expr, 0));
		
			if(x->type == LVAL_ERR){
				lval_println(x);
				lval_del(x);
			}
		
			lval_del(expr);
			lval_del(a);
		
			return lval_sexpr();
		}
	} else {
		char* err_msg = mpc_err_string(r.error);
		mpc_err_delete(r.error);
		
		lval* err = lval_err("Could not load Library %s", err_msg);
		
		free(err_msg);
		lval_del(a);
		
		return err;
	}	
} 


//在环境中注册内建函数 
void lenv_add_builtins(lenv* e){
	
	lenv_add_builtin(e, "load", builtin_load);
	lenv_add_builtin(e, "error", builtin_error);
	lenv_add_builtin(e, "print", builtin_print);
	
	lenv_add_builtin(e, "clear", builtin_cls);
	
	lenv_add_builtin(e, "if", builtin_if);
	lenv_add_builtin(e, "==", builtin_eq);
	lenv_add_builtin(e, "!=", builtin_nq);
	
	lenv_add_builtin(e, ">", builtin_gt);
	lenv_add_builtin(e, "<", builtin_lt);
	lenv_add_builtin(e, ">=", builtin_ge);
	lenv_add_builtin(e, "<=", builtin_le);
	
	lenv_add_builtin(e, "\\", builtin_lambda);
	lenv_add_builtin(e, "def", builtin_def);
	lenv_add_builtin(e, "=", builtin_put);
	
	lenv_add_builtin(e, "list", builtin_list);
	lenv_add_builtin(e, "head", builtin_head);
	lenv_add_builtin(e, "tail", builtin_tail);
	lenv_add_builtin(e, "eval", builtin_eval);
	lenv_add_builtin(e, "join", builtin_join);
	
	lenv_add_builtin(e, "+", builtin_add);
	lenv_add_builtin(e, "-", builtin_sub);
	lenv_add_builtin(e, "*", builtin_mul);
	lenv_add_builtin(e, "/", builtin_div);
}


lval* lval_call(lenv* e, lval* f, lval* a){
	
	//printf("hahaha");
	if(f->builtin){ return f->builtin(e, a); }
	
	int given = a->count;
	int total = f->formals->count;
	
	while(a->count > 0){
		if(f->formals->count == 0){
			lval_del(a);
			return lval_err("Function passed too many arguments. "
				"Got %i, Expected %i.", given, total);
		}
		
		lval* sym = lval_pop(f->formals, 0);
		
		if(strcmp(sym->sym, "&") == 0){
			if(f->formals->count != 1){
				lval_del(a);
				return lval_err("Function format invalid. "
					"Symbol '&' not followed by single symbol.");
			}
			lval* nsym = lval_pop(f->formals, 0);
			lenv_put(f->env,nsym, builtin_list(e, a));
			lval_del(sym);
			lval_del(nsym);
			break;
		}
	
		lval* val = lval_pop(a, 0);
		
		lenv_put(f->env, sym, val);
		
		lval_del(sym);
		lval_del(val); 
	}
	
	lval_del(a);
	
	if(f->formals->count > 0 &&
		strcmp(f->formals->cell[0]->sym, "&") == 0){
		
		if(f->formals->count != 2){
			return lval_err("Function format invalid. "
				"Symbol '&' not followed by single symbol.");
		}
		
		lval_del(lval_pop(f->formals, 0));
		
		lval* sym = lval_pop(f->formals, 0);
		lval* val = lval_qexpr();
		
		lenv_put(f->env, sym, val);
		lval_del(sym);
		lval_del(val);
	}
	
	if(f->formals->count == 0){
		
		f->env->par = e;
		
		return builtin_eval(f->env,
			lval_add(lval_sexpr(), lval_copy(f->body)));
	}
	
	return lval_copy(f);
} 

lval* lval_read_str(mpc_ast_t* t){
	//printf("hahaha");
	t->contents[strlen(t->contents) - 1] = '\0';
	
	char* unescaped = malloc(strlen(t->contents+1) + 1);
	strcpy(unescaped, t->contents + 1);
	unescaped = mpcf_unescape(unescaped);
	
	lval* str = lval_str(unescaped);
	free(unescaped);
	
	return str;
}


//将生成的抽象语法树转化为s-expression表达式 
lval* lval_read(mpc_ast_t* t){
	
	if(strstr(t->tag, "string"))	return lval_read_str(t);
	
	//strstr:匹配两字符串 
	if(strstr(t->tag, "number"))	return lval_read_num(t);
	if(strstr(t->tag, "symbol"))	return lval_sym(t->contents);
	
	lval* x = NULL;
	//strcmp:比较两字符串，返回字符串(大小)str1-str2，当为0二者相同 
	if(strcmp(t->tag, ">") == 0 || strstr(t->tag, "sexpr")){
		x = lval_sexpr();
	}
	if(strstr(t->tag, "qexpr")){
		x = lval_qexpr();
	}
	
	int i;
	for(i = 0; i< t->children_num; i++){
		if(strcmp(t->children[i]->contents, "(") == 0
			|| strcmp(t->children[i]->contents, ")") == 0
			|| strcmp(t->children[i]->contents, "{") == 0
			|| strcmp(t->children[i]->contents, "}") == 0
			|| strcmp(t->children[i]->tag, "regex") == 0
			|| strstr(t->children[i]->tag, "comment"))
			{
			continue;
		}
		x = lval_add(x, lval_read(t->children[i]));
	}		
	return x;
}
~~~

main

```c
int main(int argc, char** argv){
	
	//定义新的文法 
	Number = mpc_new("number");	
	Symbol = mpc_new("symbol");
	String = mpc_new("string");
	Comment = mpc_new("comment");	
	Sexpr = mpc_new("sexpr");
	Qexpr = mpc_new("qexpr");	
	Expr = mpc_new("expr");	
	Lispy = mpc_new("lispy");				
	mpca_lang(MPCA_LANG_DEFAULT,
		"													\
			number: /-?[0-9]+/;								\
			symbol: /[a-zA-Z0-9_+\\-*\\/\\\\=<>!&]+/;		\
			string: /\"(\\\\.|[^\"])*\"/;					\
			comment: /;[^\\r\\n]*/;							\
			sexpr: '(' <expr>* ')';							\
			qexpr: '{' <expr>* '}';							\
			expr: <number> | <symbol> | <string>			\
				| <sexpr> | <qexpr> | <comment>;			\
			lispy: /^/ <expr>* /$/;							\
		",
	 	Number, Symbol,	String, Comment, Sexpr, Qexpr, Expr, Lispy
	);
	
	puts("Lispy Version 1.0\nPress Ctrl+c to Exit\n");
	
	lenv* e = lenv_new();
	lenv_add_builtins(e);
	
	if(argc == 1){
		while(1){
			char* input = readLine("lispy> ");
			add_history(input);
		
			//我想用正常的中缀输入，然后转成前缀读入语法分析器 
		
			mpc_result_t res;
		
			if (mpc_parse("<stdin>", input, Lispy, &res)) {
      			lval* x = lval_eval(e, lval_read(res.output));
      			//mpc_ast_print(res.output); //打印语法树 
      			lval_println(x);
      			lval_del(x);
      			mpc_ast_delete(res.output);
    		} else {    
      			mpc_err_print(res.error);
      			mpc_err_delete(res.error);
   			}
		
			free(input);
		}
	}
	
	if(argc >= 2){
		int i;
		for(i = 1; i < argc; i++){
			lval* args = lval_add(lval_sexpr(), lval_str(argv[i]));
			
			lval* x = builtin_load(e, args);
			
			if(x->type == LVAL_ERR){
				lval_println(x);
			}
			lval_del(x);
		}
	}
	
	lenv_del(e);
	//释放树的空间 
	mpc_cleanup(8, Number, Symbol, String, Comment, Sexpr, Qexpr, Expr, Lispy);
	return 0; 
	
}
```

