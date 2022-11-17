---
title: 词法分析器
date: 2021-9-12
tags:
  - Compilation
---

> 使用 flex 自动生成识别部分 c 语言语法的词法分析器
>

## 准备

### 要求

根据给定的文法设计并实现词法分析程序，从源程序中识别出单词，记录其单词类别和单词值，输入输出及处理要求如下

- 数据结构和与语法分析程序的接口请自行定义；类别码需按下表格式统一定义
- 为了方便进行自动评测，输入的被编译源文件统一命名为 testfile.txt；输出的结果文件统一命名为 output.txt
- 每个 token 识别结果按`类别码 识别的字符\n`的形式输出

如对于以下 c 代码

```c
const int const1 = 1, const2 = -100;
const char const3 = '_';
int change1;
char change3;
int gets1(int var1,int var2){
    change1 = var1 + var2;
    return (change1);
}
void main(){
    printf("Hello World");
    printf(gets1(10, 20));
}
```

识别输出的结果为

```
CONSTTK const
INTTK int
IDENFR const1
ASSIGN =
INTCON 1
COMMA ,
IDENFR const2
ASSIGN =
MINU -
INTCON 100
SEMICN ;
CONSTTK const
CHARTK char
IDENFR const3
ASSIGN =
CHARCON _
SEMICN ;
INTTK int
IDENFR change1
SEMICN ;
CHARTK char
IDENFR change3
SEMICN ;
INTTK int
IDENFR gets1
LPARENT (
INTTK int
IDENFR var1
COMMA ,
INTTK int
IDENFR var2
RPARENT )
LBRACE {
IDENFR change1
ASSIGN =
IDENFR var1
PLUS +
IDENFR var2
SEMICN ;
RETURNTK return
LPARENT (
IDENFR change1
RPARENT )
SEMICN ;
RBRACE }
VOIDTK void
MAINTK main
LPARENT (
RPARENT )
LBRACE {
PRINTFTK printf
LPARENT (
STRCON Hello World
RPARENT )
SEMICN ;
PRINTFTK printf
LPARENT (
IDENFR gets1
LPARENT (
INTCON 10
COMMA ,
INTCON 20
RPARENT )
RPARENT )
SEMICN ;
RBRACE }
```

需要识别的单词如下

| 单词名称 | 类别码  | 单词名称 | 类别码   | 单词名称 | 类别码 | 单词名称 | 类别码  |
| -------- | ------- | -------- | -------- | -------- | ------ | -------- | ------- |
| 标识符   | IDENFR  | if       | IFTK     | -        | MINU   | =        | ASSIGN  |
| 整数     | INTCON  | else     | ELSETK   | *        | MULT   | ;        | SEMICN  |
| 字符     | CHARCON | do       | DOTK     | /        | DIV    | ,        | COMMA   |
| 字符串   | STRCON  | while    | WHILETK  | <        | LSS    | (        | LPARENT |
| const    | CONSTTK | for      | FORTK    | <=       | LEQ    | )        | RPARENT |
| int      | INTTK   | scanf    | S CANFTK | >        | GRE    | [        | LBRACK  |
| char     | CHARTK  | printf   | PRINTFTK | >=       | GEQ    | ]        | RBRACK  |
| void     | VOIDTK  | return   | RETURNTK | ==       | EQL    | {        | LBRACE  |
| main     | MAINTK  | +        | PLUS     | !=       | NEQ    | }        | RBRACE  |

### 环境

操作系统：manjaro

下载 flex

```bash
yay -S flex
```

下载 gcc

```bash
yay -S gcc
```

查看版本

```bash
flex --version
flex 2.6.4

gcc --version
gcc (GCC) 12.2.0
Copyright © 2022 Free Software Foundation, Inc.
本程序是自由软件；请参看源代码的版权声明。本软件没有任何担保；
包括没有适销性和某一专用目的下的适用性担保
```

flex 基本使用：输入`.l`文件，自动生成`lex.yy.c`及 debug 等日志文件，`lex.yy.c`即为所需词法分析器的 c 源代码

```bash
flex exam.l
```

编译`lex.yy.c`，-o 参数指定生成文件名称

```bash
gcc -o exam lex.yy.c
```

## Flex

### 概述

flex 文件，即`.l`，分三个区域

- 定义区域
- 规则区域
- c 代码区域

#### 定义区域

定义区域：引入所需 c 头文件以及写好宏定义，同时可以用正则式定义词法规则，如

```
delim		[ \t \n]
ws		{delim}+
letter		[A-Za-z_]
```

在此处定义的规则可以在规则区域通过大括号直接引入

#### 规则区域

规则区域：定义具体要识别的词法规则以及处理方式

- 字符串，如`while`，则定义为`"while" { return WHILE; }`
- 如事先在定义区域定义过，则用大括号引入，如`{ws} { ; }`，处理方式为空则表明识别但跳过

这里的处理方式实际上定义的是 yylex() 的函数体，即当 yylex 识别到某一规则时，将如何处理并返回相应值

#### c 代码区域

c 代码区域：在这定义要用到的函数以及 main 函数，如题目要求要写文件，就可以定义一个 write 函数，根据 yylex() 的返回值，我这里自定义为 int 类型，向文件里写入相应内容

- 当然也可以直接把写文件的语句写在每个词法规则的处理方式中，在 yylex 函数中解决

### lex.l

lex.l 实现要求中要识别的所有单词

```c
/*** 定义区域 ***/

%{
#include <stdio.h>
#include <string.h>

#define NEWLINE 0
#define ID 1
#define NUMBER 2
#define STR 3
#define CHARACTER 4

// 关键字
#define CONST 5
#define INT 6
#define CHAR 7
#define VOID 8
#define MAIN 9

#define IF 10
#define ELSE 11
#define	DO 12
#define WHILE 13
#define FOR 14
#define SCAN 15
#define PRINT 16
#define RETURN 17


// 赋值、算术运算
#define AS 18
#define ADD 19
#define DEC 20
#define MUL 21
#define DIV 22

// 比较
#define LT 23
#define	LE 24
#define GT 25
#define	GE 26
#define	EQ 27
#define NEQ 28

// 分号、逗号
#define SEM 29
#define COM 30

// 括号
#define LPT 31
#define RPT 32
#define LBK 33
#define RBK 34
#define LBE 35
#define RBE 36




%}

delim		[ \t \n]
ws		{delim}+
letter		[A-Za-z_]
digit		[0-9]
id		{letter}({letter}|{digit})*
number		{digit}+(\.{digit}+)?(E[+-]?{digit}+)?


%%
    /*** 規則區塊***/
    /* yytext是一個字串變數，內容是符合規則的字串本身。*/

\"[^\"]*\"	{ return (STR); } // 识别字符串，这里要手动去掉双引号
'[^']'		{ return (CHARACTER); } // 识别字符，手动去掉单引号

    /* 识别关键字及特殊符号 */

"const"		{ return (CONST); }
"int"		{ return (INT); }
"char"		{ return (CHAR); }
"void"		{ return (VOID); }
"main"		{ return (MAIN); }
"if"		{ return (IF); }
"else"		{ return (ELSE); }
"do"		{ return (DO); }
"while"		{ return (WHILE); }
"for"		{ return (FOR); }
"scanf"		{ return (SCAN); }
"printf"	{ return (PRINT); }
"return"	{ return (RETURN); }

{id}		{ return (ID); } // 识别标识符
{number}   	{ return (NUMBER); } // 识别整数数字

{ws}	 	{ ; }

"="		{ return (AS); }
"+"		{ return (ADD); }
"-"		{ return (DEC); }
"*"		{ return (MUL); }
"/"		{ return (DIV); }

"<"		{ return (LT); }
"<="		{ return (LE); }
">"		{ return (GT); }
">="		{ return (GE); }
"=="		{ return (EQ); }
"!="		{ return (NEQ); }

";"		{ return (SEM); }
","		{ return (COM); }

"("		{ return (LPT); }
")"		{ return (RPT); }
"["		{ return (LBK); }
"]"		{ return (RBK); }
"{"		{ return (LBE); }
"}"		{ return (RBE); }
.       	{ ; }

%%
/*** C程式碼區塊***/

int yywrap (){
  return 1;
}

void writeout(int c){
  switch(c){
	case NEWLINE: fprintf(yyout, "\n");break;

	case ID: fprintf(yyout, "IDENFR %s", yytext);break;
	case NUMBER: fprintf(yyout, "INTCON %s", yytext);break;
	case STR: {
	    int n = strlen(yytext);
	    //printf("%d\n", n);
	    for(int i = 0; i < n-1; i++){
		yytext[i] = yytext[i+1];
	    }
	    yytext[n-2] = '\0';
	    fprintf(yyout, "STRCON %s", yytext);
	    break;
	}
	case CHARACTER: {
	    int n = strlen(yytext);
	    //printf("%d\n", n);
	    for(int i = 0; i < n-1; i++){
		yytext[i] = yytext[i+1];
	    }
	    yytext[n-2] = '\0';
	    fprintf(yyout, "CHARCON %s", yytext);
	    break;
	}

	// 关键字
	case CONST: fprintf(yyout, "CONSTTK %s", yytext);break;
	case INT: fprintf(yyout, "INTTK %s", yytext);break;
	case CHAR: fprintf(yyout, "CHARTK %s", yytext);break;
	case VOID: fprintf(yyout, "VOIDTK %s", yytext);break;
	case MAIN: fprintf(yyout, "MAINTK %s", yytext);break;

	case IF: fprintf(yyout, "IFTK %s", yytext);break;
	case ELSE: fprintf(yyout, "ELSETK %s", yytext);break;
	case DO: fprintf(yyout, "DOTK %s", yytext);break;
	case WHILE: fprintf(yyout, "WHILETK %s", yytext);break;
	case FOR: fprintf(yyout, "FORTK %s", yytext);break;
	case SCAN: fprintf(yyout, "SCANFTK %s", yytext);break;
	case PRINT: fprintf(yyout, "PRINTFTK %s", yytext);break;
	case RETURN: fprintf(yyout, "RETURNTK %s", yytext);break;


	// 赋值、算术运算
	case AS: fprintf(yyout, "ASSIGN %s", yytext);break;
	case ADD: fprintf(yyout, "PLUS %s", yytext);break;
	case DEC: fprintf(yyout, "MINU %s", yytext);break;
	case MUL: fprintf(yyout, "MULT %s", yytext);break;
	case DIV: fprintf(yyout, "DIV %s", yytext);break;
	
	// 比较
	case LT: fprintf(yyout, "LSS %s", yytext);break;
	case LE: fprintf(yyout, "LEQ %s", yytext);break;
	case GT: fprintf(yyout, "GRE %s", yytext);break;
	case GE: fprintf(yyout, "GEQ %s", yytext);break;
	case EQ: fprintf(yyout, "EQL %s", yytext);break;
	case NEQ: fprintf(yyout, "NEQ %s", yytext);break;
	
	// 分号、逗号
	case SEM: fprintf(yyout, "SEMICN %s", yytext);break;
	case COM: fprintf(yyout, "COMMA %s", yytext);break;
	
	// 括号
	case LPT: fprintf(yyout, "LPARENT %s", yytext);break;
	case RPT: fprintf(yyout, "RPARENT %s", yytext);break;
	case LBK: fprintf(yyout, "LBRACK %s", yytext);break;
	case RBK: fprintf(yyout, "RBRACK %s", yytext);break;
	case LBE: fprintf(yyout, "LBRACE %s", yytext);break;
	case RBE: fprintf(yyout, "RBRACE %s", yytext);break;
    	default: break;
  }
  return;
}


int main (void){
	int c;
	/*
	if (argc >= 2){
	    if ((yyin = fopen(argv[1], "r")) == NULL){
		printf("Can't open file %s\n", argv[1]);
	   	return 1;
	    }
	    if (argc >= 3){
		yyout = fopen(argv[2], "w");
	    }
	}
	*/
	if((yyin = fopen("testfile.txt", "r")) == NULL){
	    printf("can't open testfile.txt");
	    return 1;
	}
	if((yyout = fopen("output.txt", "w")) == NULL){
	    printf("can't open output.txt");
	    return 1;
	}
	while (c = yylex()){
	    writeout(c);
	    writeout(NEWLINE);
	}
	fclose(yyin);
	fclose(yyout);
	/*
	if(argc>=2){
	    fclose(yyin);
	    if (argc >= 3) fclose(yyout);
	}
	*/
	return 0;
}
```

### 编译运行

run.sh

```bash
flex lex.l
gcc -o lexer lex.yy.c

./lexer
```

测试结果满昏



