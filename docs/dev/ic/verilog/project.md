---
title: 计组课设
date: 2023-1-2
---

## 32 位除法器

```verilog
`timescale 1ns / 1ps

module div32(
    input clk,rst_n,
    input start,
    input [31:0] a,
    input [31:0] b,
    output done,
    output [31:0] yshang,
    output [31:0] yyushu
    ); 
    reg[63:0] temp_a;
    reg[63:0] temp_b;
    reg[5:0] i;
    reg done_r;
    
    always @(posedge clk or negedge rst_n)begin
        if(!rst_n) i <= 6'd0;
        else if(start && i < 6'd33) i <= i+1'b1;
        else i <= 6'd0;
    end
    
    always @(posedge clk or negedge rst_n)begin
        if(!rst_n) done_r <= 1'b0;
        else if(i == 6'd32) done_r <= 1'b1;        
        else if(i == 6'd33) done_r <= 1'b0;   
    end     
    assign done = done_r;
        
    always @ (posedge clk or negedge rst_n)begin
        if(!rst_n) begin
            temp_a <= 64'h0;
            temp_b <= 64'h0;
        end else if(start) begin
            if(i == 6'd0) begin
                temp_a = {32'h00000000,temp_a};
                temp_b = {temp_b,32'h00000000}; 
            end else begin
                temp_a = temp_a << 1;
                if(temp_a >= temp_b) temp_a = temp_a - temp_b + 1'b1;
                else temp_a = temp_a;
            end
        end
    end
    assign yshang = temp_a[31:0];
    assign yyushu = temp_a[63:32];
endmodule
```

## 五级流水 CPU

在单周期 CPU 里，一个 clk 上升沿将完成以下内容：取值 - 译码 - 执行 - 回写

在流水 CPU 中，首先过程增加一级，为：取值 - 译码 - 执行 - 访存 - 回写；第二，它把每个过程通过时钟周期分隔开，如

| 时钟周期 | 取值  | 译码  | 执行  | 访存  | 回写  |
| -------- | ----- | ----- | ----- | ----- | ----- |
| 1        | 取值1 |       |       |       |       |
| 2        | 取值2 | 译码1 |       |       |       |
| 3        | 取值3 | 译码2 | 执行1 |       |       |
| 4        | 取值4 | 译码3 | 执行2 | 访存1 |       |
| 5        | 取值5 | 译码4 | 执行3 | 访存2 | 回写1 |
| 6        | 取值6 | 译码5 | 执行4 | 访存3 | 回写2 |
| ...      |       |       |       |       |       |

以这样的形式对每条指令进行执行，在一定数量后，每个时钟周期均有指令完成，效率更高，当减少 clk 的时间长度（相较于单周期，流水线 CPU 在一个时钟周期内要做的事更少），指令的执行频率将越高，此之谓提高主频

要实现这样的过程，需要在每个步骤之间加一层流水线传输级，用 clk 的上升沿控制数据的传输，以实现步骤执行的分割

<img src="./assets/pipeline_cpu.jpg">
