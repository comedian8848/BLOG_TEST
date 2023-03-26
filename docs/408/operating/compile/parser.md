---
title: 语法分析器
date: 2021-9-12
tags:
  - Compilation
---

> 这个语法分析器做的很失败，bison 文法定义定义不明白，功亏一篑

## 准备

### 要求

请根据给定的文法设计并实现语法分析程序（推荐自顶向下的递归子程序分析方法），基于词法分析实验所识别出的单词，进一步识别出各类语法成分，输入输出及处理要求如下

- 需按文法规则，用递归子程序法对文法中定义的所有种语法成分进行分析
- 为了方便进行自动评测，输入的被编译源文件统一命名为testfile.txt；输出的结果文件统一命名为output.txt，结果文件中包含如下两种信息
  - 按词法分析识别单词的顺序，按行输出每个单词的信息（要求同词法分析作业，对于预读的情况不能输出）
  - 在下列高亮显示的语法分析成分分析结束前，另起一行输出当前语法成分的名字，形如“<常量说明>”（注：未要求输出的语法成分仍需要分析）
- 注意输出文件要求中文字符的编码格式要求是UTF-8

文法定义如下

- ＜加法运算符＞ ::= +｜-
- ＜乘法运算符＞ ::= *｜/
- ＜关系运算符＞ ::= <｜<=｜>｜>=｜!=｜==
- ＜字母＞  ::= ＿｜a｜．．．｜z｜A｜．．．｜Z
- ＜数字＞  ::= ０｜＜非零数字＞
- ＜非零数字＞ ::= １｜．．．｜９
- ＜字符＞  ::= '＜加法运算符＞'｜'＜乘法运算符＞'｜'＜字母＞'｜'＜数字＞'
- ＜字符串＞  ::= "｛十进制编码为32,33,35-126的ASCII字符｝"
- ＜程序＞  ::= ［＜常量说明＞］［＜变量说明＞］{＜有返回值函数定义＞|＜无返回值函数定义＞}＜主函数＞
- ＜常量说明＞ ::= const＜常量定义＞;{ const＜常量定义＞;}
- ＜常量定义＞  ::=  int＜标识符＞＝＜整数＞{,＜标识符＞＝＜整数＞} | char＜标识符＞＝＜字符＞{,＜标识符＞＝＜字符＞}
- ＜无符号整数＞ ::= ＜非零数字＞｛＜数字＞｝| 0
- ＜整数＞    ::= ［＋｜－］＜无符号整数＞
- ＜标识符＞  ::= ＜字母＞｛＜字母＞｜＜数字＞｝
- ＜声明头部＞  ::= int＜标识符＞ |char＜标识符＞
- ＜变量说明＞ ::= ＜变量定义＞;{＜变量定义＞;}
- ＜变量定义＞ ::= ＜类型标识符＞(＜标识符＞|＜标识符＞'['＜无符号整数＞']'){,(＜标识符＞|＜标识符＞'['＜无符号整数＞']' )}
- ＜类型标识符＞   ::= int | char
- ＜有返回值函数定义＞ ::= ＜声明头部＞'('＜参数表＞')' '{'＜复合语句＞'}'
- ＜无返回值函数定义＞ ::= void＜标识符＞'('＜参数表＞')''{'＜复合语句＞'}'
- ＜复合语句＞  ::= ［＜常量说明＞］［＜变量说明＞］＜语句列＞
- ＜参数表＞  ::= ＜类型标识符＞＜标识符＞{,＜类型标识符＞＜标识符＞}| ＜空＞
- ＜主函数＞  ::= void main‘(’‘)’ ‘{’＜复合语句＞‘}’
- ＜表达式＞  ::= ［＋｜－］＜项＞{＜加法运算符＞＜项＞} 
- ＜项＞   ::= ＜因子＞{＜乘法运算符＞＜因子＞}
- ＜因子＞  ::= ＜标识符＞｜＜标识符＞'['＜表达式＞']'|'('＜表达式＞')'｜＜整数＞|＜字符＞｜＜有返回值函数调用语句＞    
- ＜语句＞  ::= ＜条件语句＞｜＜循环语句＞| '{'＜语句列＞'}'| ＜有返回值函数调用语句＞; |＜无返回值函数调用语句＞;｜＜赋值语句＞;｜＜读语句＞;｜＜写语句＞;｜＜空＞;|＜返回语句＞;
- ＜赋值语句＞  ::= ＜标识符＞＝＜表达式＞|＜标识符＞'['＜表达式＞']'=＜表达式＞
- ＜条件语句＞ ::= if '('＜条件＞')'＜语句＞［else＜语句＞］
- ＜条件＞  ::= ＜表达式＞＜关系运算符＞＜表达式＞ //整型表达式之间才能进行关系运算 ｜＜表达式＞  //表达式为整型，其值为0条件为假，值不为0时条件为真               
- ＜循环语句＞  ::= while '('＜条件＞')'＜语句＞| do＜语句＞while '('＜条件＞')' |for'('＜标识符＞＝＜表达式＞;＜条件＞;＜标识符＞＝＜标识符＞(+|-)＜步长＞')'＜语句＞
- ＜步长＞::= ＜无符号整数＞ 
- ＜有返回值函数调用语句＞ ::= ＜标识符＞'('＜值参数表＞')'
- ＜无返回值函数调用语句＞ ::= ＜标识符＞'('＜值参数表＞')'
- ＜值参数表＞  ::= ＜表达式＞{,＜表达式＞}｜＜空＞
- ＜语句列＞  ::= ｛＜语句＞｝
- ＜读语句＞  ::= scanf '('＜标识符＞{,＜标识符＞}')'
- ＜写语句＞  ::= printf '(' ＜字符串＞,＜表达式＞ ')'| printf '('＜字符串＞ ')'| printf '('＜表达式＞')'
- ＜返回语句＞  ::= return['('＜表达式＞')']  

输入样例

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

对应输出

```
CONSTTK const
INTTK int
IDENFR const1
ASSIGN =
INTCON 1
<无符号整数>
<整数>
COMMA ,
IDENFR const2
ASSIGN =
MINU -
INTCON 100
<无符号整数>
<整数>
<常量定义>
SEMICN ;
CONSTTK const
CHARTK char
IDENFR const3
ASSIGN =
CHARCON _
<常量定义>
SEMICN ;
<常量说明>
INTTK int
IDENFR change1
<变量定义>
SEMICN ;
CHARTK char
IDENFR change3
<变量定义>
SEMICN ;
<变量说明>
INTTK int
IDENFR gets1
<声明头部>
LPARENT (
INTTK int
IDENFR var1
COMMA ,
INTTK int
IDENFR var2
<参数表>
RPARENT )
LBRACE {
IDENFR change1
ASSIGN =
IDENFR var1
<因子>
<项>
PLUS +
IDENFR var2
<因子>
<项>
<表达式>
<赋值语句>
SEMICN ;
<语句>
RETURNTK return
LPARENT (
IDENFR change1
<因子>
<项>
<表达式>
RPARENT )
<返回语句>
SEMICN ;
<语句>
<语句列>
<复合语句>
RBRACE }
<有返回值函数定义>
VOIDTK void
MAINTK main
LPARENT (
RPARENT )
LBRACE {
PRINTFTK printf
LPARENT (
STRCON Hello World
<字符串>
RPARENT )
<写语句>
SEMICN ;
<语句>
PRINTFTK printf
LPARENT (
IDENFR gets1
LPARENT (
INTCON 10
<无符号整数>
<整数>
<因子>
<项>
<表达式>
COMMA ,
INTCON 20
<无符号整数>
<整数>
<因子>
<项>
<表达式>
<值参数表>
RPARENT )
<有返回值函数调用语句>
<因子>
<项>
<表达式>
RPARENT )
<写语句>
SEMICN ;
<语句>
<语句列>
<复合语句>
RBRACE }
<主函数>
<程序>
```

### 环境

安装 bison

```bash
yay -S bison
```

## Bison

### calc

使用 flex 和 bison 实现计算器

calc.l，识别运算符和数字

```c
%{
#include "y.tab.h"
%}

%%
[0-9]+          { yylval = atoi(yytext); return NUMBER; }
[-/+*()\n]      { return yytext[0]; }
.               { return 0; /* end when meet everything else */ }
%%

int yywrap(void) { 
    return 1;
}
```

calc.y，处理识别到的 token，将注释去掉将可以读 / 写文件

```c
%{
#include <stdio.h>
void yyerror(const char* msg) {}
static FILE* yyout;
%}

%token NUMBER

%left '+' '-'
%left '*' '/'

%%

S   :   S E '\n'        { fprintf(yyout, "ans = %d\n", $2); }
    |   /* empty */     { /* empty */ }
    ;

E   :   E '+' E         { $$ = $1 + $3; }
    |   E '-' E         { $$ = $1 - $3; }
    |   E '*' E         { $$ = $1 * $3; }
    |   E '/' E         { $$ = $1 / $3; }
    |   NUMBER          { $$ = $1; }
    |   '(' E ')'       { $$ = $2; }
    ;

%%

int main() {
    extern FILE *yyin;
    //yyin = fopen("testfile.txt", "r");
    extern FILE *yyout;
    //yyout = fopen("output.txt", "w");
    yyparse();
    return 0;
}
```

build.sh

```bash
flex calc.l
bison -vtdy calc.y
gcc -o calc lex.yy.c y.tab.c
```

执行

```bash
./calc

1+2
ans=3
```

### parser

#### flex 部分

将词法分析器的内容稍作修改，识别时即写出

- 不再使用 write 函数在 main 函数中进行写出
- 不再对 token 进行宏定义为 int，转而在 parser.y 中定义，再在 lex.l 中引入头文件

lex.l

```c
%{
/* 會直接照搬放檔頭的C code */
#include <stdio.h>
#include <string.h>
#include "y.tab.h"
%}

delim		[ \t \n]
ws		{delim}+
letter		[A-Za-z_]
unsigned	[1-9]
digit		[0-9]
id		{letter}({letter}|{digit})*
number		{unsigned}({digit})*
zero		0


/* 這裡告訴flex只要讀取輸入的檔案（不需要其他檔案）*/

%%
    /*** 規則區塊***/
    /* yytext是一個字串變數，內容是符合規則的字串本身。*/

\"[^\"]*\"	{ 
		    int n = strlen(yytext);
	    	    //printf("%d\n", n);
	    	    for(int i = 0; i < n-1; i++){
			yytext[i] = yytext[i+1];
	   	    }
	    	    yytext[n-2] = '\0';
	    	    fprintf(yyout, "STRCON %s\n", yytext);
		    return (STR);
		} // 识别字符串，这里要手动去掉双引号

'[^']'		{ 
		    int n = strlen(yytext);
	    	    //printf("%d\n", n);
	    	    for(int i = 0; i < n-1; i++){
			yytext[i] = yytext[i+1];
	    	    }
	    	    yytext[n-2] = '\0';
	    	    fprintf(yyout, "CHARCON %s\n", yytext);
	    	    return (CHARACTER); 
		} // 识别字符，手动去掉单引号

    /* 识别关键字及特殊符号 */

"const"		{ fprintf(yyout, "CONSTTK %s\n", yytext); return (CONST); }
"int"		{ fprintf(yyout, "INTTK %s\n", yytext); return (INT); }
"char"		{ fprintf(yyout, "CHARTK %s\n", yytext); return (CHAR); }
"void"		{ fprintf(yyout, "VOIDTK %s\n", yytext); return (VOID); }
"main"		{ fprintf(yyout, "MAINTK %s\n", yytext); return (MAIN); }
"if"		{ fprintf(yyout, "IFTK %s\n", yytext); return (IF); }
"else"		{ fprintf(yyout, "ELSETK %s\n", yytext); return (ELSE); }
"do"		{ fprintf(yyout, "DOTK %s\n", yytext); return (DO); }
"while"		{ fprintf(yyout, "WHILETK %s\n", yytext); return (WHILE); }
"for"		{ fprintf(yyout, "FORTK %s\n", yytext); return (FOR); }
"scanf"		{ fprintf(yyout, "SCANFTK %s\n", yytext); return (SCAN); }
"printf"	{ fprintf(yyout, "PRINTFTK %s\n", yytext); return (PRINT); }
"return"	{ fprintf(yyout, "RETURNTK %s\n", yytext); return (RETURN); }

{id}		{ fprintf(yyout, "IDENFR %s\n", yytext); return (ID); } // 识别标识符
{number}   	{ fprintf(yyout, "INTCON %s\n", yytext); return (NUMBER); } // 识别整数数字
{zero}		{ fprintf(yyout, "INTCON %s\n", yytext); return ZERO; }

{ws}	 	{ ; }

"="		{ fprintf(yyout, "ASSIGN %s\n", yytext); return (ASSIGN); }
"+"		{ fprintf(yyout, "PLUS %s\n", yytext); return (ADD); }
"-"		{ fprintf(yyout, "MINU %s\n", yytext); return (SUB); }
"*"		{ fprintf(yyout, "MULT %s\n", yytext); return (MUL); }
"/"		{ fprintf(yyout, "DIV %s\n", yytext); return (DIV); }

"<"		{ fprintf(yyout, "LSS %s\n", yytext); return (LSS); }
"<="		{ fprintf(yyout, "LEQ %s\n", yytext); return (LEQ); }
">"		{ fprintf(yyout, "GRE %s\n", yytext); return (GRE); }
">="		{ fprintf(yyout, "GEQ %s\n", yytext); return (GEQ); }
"=="		{ fprintf(yyout, "EQL %s\n", yytext); return (EQL); }
"!="		{ fprintf(yyout, "NEQ %s\n", yytext); return (NEQ); }

";"		{ fprintf(yyout, "SEMICN %s\n", yytext); return (SEMICOLON); }
","		{ fprintf(yyout, "COMMA %s\n", yytext); return (COMMA); }

"("		{ fprintf(yyout, "LPARENT %s\n", yytext); return (LPARENT); }
")"		{ fprintf(yyout, "RPARENT %s\n", yytext); return (RPARENT); }
"["		{ fprintf(yyout, "LBRACK %s\n", yytext); return (LBRACK); }
"]"		{ fprintf(yyout, "RBRACK %s\n", yytext); return (RBRACK); }
"{"		{ fprintf(yyout, "LBRACE %s\n", yytext); return (LBRACE); }
"}"		{ fprintf(yyout, "RBRACE %s\n", yytext); return (RBRACE); }
.       	{ ; }

%%
/*** C程式碼區塊***/

int yywrap (){
    return 1;
}
```

#### bison 部分

同样分为三部分

- 定义区域：定义 c 头文件，token 符号，将自动分配 int 值
- 规则区域：定义文法
- c 代码区域：同 flex

parser.y

```c
%{
#include <stdio.h>
extern FILE* yyout;
void yyerror(const char* msg) {}
int yylex();
%}

%debug

%locations

%token STR // 字符串
%token CHARACTER // 字符

%token CONST // const
%token INT // int
%token CHAR // char
%token VOID // void
%token MAIN // main
%token IF // if
%token ELSE // else
%token DO // do
%token WHILE // while
%token FOR // for
%token SCAN // scanf
%token PRINT // printf
%token RETURN // return

%token ID // 识别标识符
%token NUMBER // 整数
%token ZERO // 0

%token LPARENT // (
%token RPARENT // )
%token LBRACE RBRACE RBRACK LBRACK // {}, [] 
%token SEMICOLON // ;
%token COMMA // ,

%left ASSIGN // 赋值 =
%left NEQ EQL // 等，不等 == !=
%left LSS GRE LEQ GEQ // 比较 < > <= >=
%left ADD SUB // 加减 + -
%left MUL DIV // 乘除 * /

%start s
%%

/* 语法规则 */
s
    : s program				{ fprintf(yyout, "<程序>\n"); }
    | program				
    ;

add_cal
    : ADD
    | SUB
    ;

mul_cal
    : MUL
    | DIV
    ;

relation_cal
    : NEQ
    | EQL
    | LSS
    | GRE
    | LEQ
    | GEQ
    ;

character
    : CHARACTER
    ;

type
    : INT
    | CHAR
    ;

string
    : STR				{ fprintf(yyout, "<字符串>\n"); }
    ;


program
    : declaration
    | function
    ;

declaration
    : const_declaration			{ fprintf(yyout, "<常量说明>\n"); }
    | variable_declaration		{ fprintf(yyout, "<变量说明>\n"); }
    ;

const_declaration
    : const_declaration const_definition SEMICOLON 
    | const_definition SEMICOLON
    ;

const_definition
    : const_definition SEMICOLON CONST type const_assign  
    | CONST type const_assign  		  
    ;

const_assign
    : const_assign COMMA ID ASSIGN signed_number { fprintf(yyout, "<常量定义>\n"); }
    | ID ASSIGN signed_number			 { fprintf(yyout, "<常量定义>\n"); }
    | const_assign COMMA ID ASSIGN character	 { fprintf(yyout, "<常量定义>\n"); }
    | ID ASSIGN character			 { fprintf(yyout, "<常量定义>\n"); }		
    ;


unsigned_number
    : num_without_sign		{ fprintf(yyout, "<无符号整数>\n"); }
    ;

signed_number
    : num_with_sign		{ fprintf(yyout, "<整数>\n"); }
    ;

num_with_sign
    : unsigned_number
    | ADD unsigned_number
    | SUB unsigned_number
    ;

num_without_sign
    : NUMBER
    | ZERO
    ;

variable_declaration
    : variable_declaration variable_definition SEMICOLON 
    | variable_definition SEMICOLON 			 
    ;

variable_definition 
    : type variable_assign     
    ;

variable_assign
    : variable_assign COMMA variable
    | variable
    ;

variable
    : ID				{ fprintf(yyout, "<变量定义>\n"); }
    | ID LBRACK unsigned_number RBRACK  { fprintf(yyout, "<变量定义>\n"); }
    ;



function
    : void 	{ fprintf(yyout, "<无返回值函数定义>\n"); }
    | general   { fprintf(yyout, "<有返回值函数定义>\n"); }
    | main      { fprintf(yyout, "<主函数>\n"); }
    ;

void
    : VOID ID LPARENT param_list RPARENT LBRACE complex_sentence RBRACE 
    ;

general
    : declaration_head LPARENT param_list RPARENT LBRACE complex_sentence RBRACE 
    ;

main
    : VOID MAIN LPARENT RPARENT LBRACE complex_sentence RBRACE 
    ;

declaration_head
    : type ID			{ fprintf(yyout, "<声明头部>\n"); }
    ;

param_list
    : type param	    	{ fprintf(yyout, "<参数表>\n"); }
    |
    ;	

param
    : ID
    | param COMMA type ID
    ;

complex_sentence
    : const_declaration variable_declaration sentence_list    { fprintf(yyout, "<复合语句>\n"); }
    ;

expression
    : expression add_cal item	{ fprintf(yyout, "<表达式>\n"); }
    | expr			
    ;

expr
    : add_cal item
    | item			{ fprintf(yyout, "<项>\n"); }
    ;

item
    : item mul_cal fact
    | fact			{ fprintf(yyout, "<因子>\n"); }
    ;

fact
    : ID				{ /*fprintf(yyout, "<标识符>");*/ }
    | ID LBRACK expression RBRACK
    | LPARENT expression RPARENT
    | signed_number
    | character				{ /*fprintf(yyout, "<字符>");*/ }
    | call_with_return			{ fprintf(yyout, "<有返回值函数调用语句>\n"); }
    ;

sentence
    : condition_sentence SEMICOLON		{ fprintf(yyout, "<条件语句>\n"); }
    | circle_sentence SEMICOLON			{ fprintf(yyout, "<循环语句>\n"); }
    | LBRACE sentence_list RBRACE SEMICOLON	{ fprintf(yyout, "<语句列>\n"); }
    | call_with_return SEMICOLON		{ fprintf(yyout, "<有返回值函数调用语句>\n"); }
    | call_without_return SEMICOLON		{ fprintf(yyout, "<无返回值函数调用语句>\n"); }
    | assign_sentence SEMICOLON			{ fprintf(yyout, "<赋值语句>\n"); }
    | read_sentence SEMICOLON			{ fprintf(yyout, "<读语句>\n"); }
    | write_sentence SEMICOLON			{ fprintf(yyout, "<写语句>\n"); }
    | SEMICOLON
    | return_sentence SEMICOLON			{ fprintf(yyout, "<返回语句>\n"); }
    ;

assign_sentence
    : ID ASSIGN expression
    | ID LBRACK expression RBRACK ASSIGN expression
    ;

condition_sentence
    : IF LPARENT condition RPARENT sentence		  
    | IF LPARENT condition RPARENT sentence ELSE sentence
    ;

condition
    : expression relation_cal expression { fprintf(yyout, "<条件>\n"); }
    | expression			 { fprintf(yyout, "<条件>\n"); }
    ;

circle_sentence
    : WHILE LPARENT condition RPARENT sentence
    | DO sentence WHILE LPARENT condition RPARENT
    | FOR LPARENT ID ASSIGN expression SEMICOLON condition SEMICOLON ID ASSIGN ID add_cal step RPARENT sentence
    ;

step
    : unsigned_number		{ fprintf(yyout, "<步长>\n"); }
    ;

call_with_return
    : ID LPARENT value_param_list RPARENT
    ;

call_without_return
    : ID LPARENT value_param_list RPARENT
    ;

value_param_list
    : table 		{ fprintf(yyout, "<值参数表>\n"); }
    |
    ;

table
    : expression
    | table COMMA expression
    ;

sentence_list
    : sentence_list sentence
    |
    ;

read_sentence
    : SCAN LPARENT id_list RPARENT
    ;

id_list
    : ID
    | id_list COMMA ID
    ;

write_sentence
    : PRINT LPARENT string COMMA expression RPARENT
    | PRINT LPARENT string RPARENT
    | PRINT LPARENT expression RPARENT
    ;

return_sentence
    : RETURN SEMICOLON
    | RETURN LPARENT expression RPARENT
    ;

%%

int main() {
    extern FILE *yyin;
    yyin = fopen("testfile.txt", "r");
    extern FILE *yyout;
    yyout = fopen("output.txt", "w");
    while(yyparse()){}
    return 0;
}
```

#### 联合编译

build.sh

```bash
flex lex.l
bison -vtdy parser.y 
gcc -o parser lex.yy.c y.tab.c
```

测试样例一个没过，太失败了，问题全出在文法定义区域

```bash
parser.y: 警告: 9 项偏移/归约冲突 [-Wconflicts-sr]
parser.y: 警告: 1 项归约/归约冲突 [-Wconflicts-rr]
parser.y: note: rerun with option '-Wcounterexamples' to generate conflict counterexamples
parser.y:258.7-41: 警告: 由于冲突，解析器中的规则不起作用 [-Wother]
  258 |     : ID LPARENT value_param_list RPARENT
      |       ^~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
```

