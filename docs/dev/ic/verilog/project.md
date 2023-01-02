---
title: 计组课设
date: 2023-1-2
---

## 32 位除法器

设计代码：div32.v

```verilog
`timescale 1ns / 1ps

module div32(
    input [31:0] a,
    input [31:0] b,
    output [31:0] result,
    output [31:0] remainder
    ); 
    reg[63:0] temp_a;
    reg[63:0] temp_b;
    reg[31:0] temp_r;
        
    integer i;
    always @ (*) begin
        temp_a = {32'd0, a};
        temp_b = {b, 32'd0};
        temp_r = 0;
        for(i = 0; i < 32; i = i+1) begin
            temp_a = temp_a << 1;
            temp_r = temp_r << 1;
            if(temp_a >= temp_b) begin
                temp_a = temp_a - temp_b;
                temp_r[0] = 1;
            end else begin
                temp_a = temp_a;
                temp_r[0] = 0;
            end
        end
    end
    assign result = temp_r;
    assign remainder = temp_a[63:32];
endmodule
```

测试代码：div32_tb.v

```verilog
`timescale 1ns / 1ps

module div32_tb(
    );
    reg [31:0] a;
    reg [31:0] b;
    wire [31:0] result;
    wire [31:0] remainder;
    
    div32 div320(a, b, result, remainder);
    
    integer i;
    initial begin
        b = 32'd7;
        for(i = 102; i < 152; i = i+1) begin
            #20
            a = i;
        end
        #1000 $finish;
    end
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

要实现这样的过程，需要在每个步骤之间加一层流水线传输级，用 clk 的上升沿控制数据的传输，以实现步骤的分割

<img src="./assets/pipeline_cpu.jpg">

将存储器和 CPU 解耦，和单周期类似，以 SOPC 的形式将五级流水 CPU 和存储器 inst_rom 连接，如下所示

<img src="./assets/SOPC2.jpg">

### SOPC

mips_sopc.v

```verilog
`timescale 1ns / 1ps
`include "./defines.v"

module mips_sopc(
    input wire clk,
    input wire rst
    );
    wire rom_ce;
    wire[`InstAddrBus]inst_addr;
    wire[`InstBus]inst;
    pipeline_cpu pipeline_cpu0(rst, clk, inst, rom_ce, inst_addr);
    inst_rom inst_rom0(rom_ce, inst_addr, inst);
endmodule
```

### 存储器 ROM

inst_rom.v

```verilog
`timescale 1ns / 1ps
`include "./defines.v"

module inst_rom(
    input wire ce,
    input wire [`InstAddrBus] addr,
    output reg [`InstBus] inst
    );
    reg [`InstBus] inst_mem[0:127];
    
    initial begin
        $readmemh("C:/File/vivado/inst_rom.data", inst_mem);
    end
    
    always@(*) begin
        if(ce == `CeDisable) begin
            inst <= `ZeroWord;
        end else begin
            inst <= inst_mem[addr[31:2]];
        end
    end
endmodule
```

### 五级流水 CPU

pipeline_cpu.v

```verilog
`timescale 1ns / 1ps
`include "./defines.v"

module pipeline_cpu(
    input wire rst,
    input wire clk,
    input wire[`InstBus] rom_data_i,
    output wire rom_ce_o,
    output wire[`InstAddrBus] rom_addr_o
    );
    pc pc0(clk,rst,rom_addr_o,rom_ce_o);
    wire[`InstBus] id_inst_i;
    if_id if_id0(clk,rst,rom_data_i,id_inst_i);
    wire[`Aluop_OnehotBus]id_aluop_o;
    wire[`RegDataBus]id_reg1_o;
    wire[`RegDataBus]id_reg2_o;
    wire[`RegAddrBus]id_wd_o;
    wire id_wreg_o;
    wire[`RegDataBus]reg1_data;
    wire[`RegDataBus]reg2_data;
    wire reg1_read;
    wire reg2_read;
    wire[`RegAddrBus]reg1_addr;
    wire[`RegAddrBus]reg2_addr;
    id id0(rst,id_inst_i,reg1_data,reg2_data,id_aluop_o,
            id_reg1_o,id_reg2_o,id_wd_o,id_wreg_o,
            reg1_addr,reg2_addr,reg1_read,reg2_read);
    wire [`Aluop_OnehotBus]ex_aluop_i;
    wire[`RegDataBus]ex_reg1_i;
    wire[`RegDataBus]ex_reg2_i;
    wire[`RegAddrBus]ex_wd_i;
    wire ex_wreg_i;
    id_ex id_ex0(rst,clk,id_aluop_o,id_reg1_o,id_reg2_o,id_wd_o,id_wreg_o,
                ex_aluop_i,ex_reg1_i,ex_reg2_i,ex_wd_i,ex_wreg_i);
    wire[`RegDataBus]ex_wdata_o;
    wire[`RegAddrBus]ex_wd_o;
    wire ex_wreg_o;
    alu alu0(ex_reg1_i,ex_reg2_i,ex_aluop_i,ex_wd_i,ex_wreg_i,
             ex_wdata_o,ex_wd_o,ex_wreg_o);
    wire[`RegDataBus]mem_wdata_i;
    wire[`RegAddrBus]mem_wd_i;
    wire mem_wreg_i;
    ex_mem ex_mem0(clk,rst,ex_wdata_o,ex_wd_o,ex_wreg_o,
                    mem_wdata_i,mem_wd_i,mem_wreg_i);
    wire[`RegDataBus]mem_wdata_o;
    wire[`RegAddrBus]mem_wd_o;
    wire mem_wreg_o;
    mem mem0(rst, mem_wdata_i, mem_wd_i, mem_wreg_i,
             mem_wdata_o, mem_wd_o, mem_wreg_o);
             
    wire[`RegDataBus]wb_wdata_i;
    wire[`RegAddrBus]wb_wd_i;
    wire wb_wreg_i;
    mem_wb mem_wb0(clk,rst,mem_wdata_o,mem_wd_o,mem_wreg_o,
                    wb_wdata_i,wb_wd_i,wb_wreg_i);
    regfile regfile0(rst,clk,wb_wd_i,wb_wdata_i,wb_wreg_i,
    reg1_addr,reg1_read,reg1_data,reg2_addr,reg2_read,reg2_data);
    
endmodule
```

### 程序计数器 PC

pc.v

```verilog
`timescale 1ns / 1ps

module pc(
    input wire clk, // 时钟信号
    input wire rst, // 复位信号
    output reg [31:0] pc, // 要读的指令地址
    output reg ce // 使能信号
    );
    
    always@ (posedge clk) begin
        if(rst == 1)begin
            ce <= 0;
        end else begin
            ce <= 1;
        end
    end
    
    // 只有当复位信号无效时，使能信号有效，才给地址赋值，否则为 0
    always@(posedge clk)begin
        if(ce == 0)begin
            pc <= 32'b0;
        end else begin 
            pc <= pc + 4;
        end
    end
endmodule
```

### 译码器 ID

id.v

```verilog
`timescale 1ns / 1ps
`include"./defines.v"

module id(
    input wire rst,
    input wire[`InstBus] inst_i,        // 指令  
    input wire[`RegDataBus]reg1_data_i, // 输入操作码1
    input wire[`RegDataBus]reg2_data_i, // 输入操作码2
    output wire[`Aluop_OnehotBus]aluop_o, // 指令类别，用热独码存
    output wire[`RegDataBus]reg1_o, // 就是输入的 reg1_data_i
    output wire[`RegDataBus]reg2_o, // 输入的 reg2_data_i
    output wire[`RegAddrBus]wd_o,   // 目的写寄存器地址
    output wire wreg_o,             // 写权限
    output wire[`RegAddrBus]reg1_addr_o,    // 读寄存器地址1
    output wire[`RegAddrBus]reg2_addr_o,    // 读寄存器地址2
    output wire reg1_read_o,        // 读权限1
    output wire reg2_read_o         // 读权限2
    );
    // 先用四个解码器解析 32 位指令，获取操作数、指令以及目的地址
    wire[5:0] op;
    wire[4:0] op1;
    wire[4:0] sa;
    wire[5:0] func;
    wire[63:0] op_d;
    wire[31:0] op1_d;
    wire[31:0] sa_d;
    wire[63:0] func_d;
    assign op = inst_i[31:26]; // 运算数 1
    assign op1 = inst_i[25:21]; // 运算数 2
    assign sa = inst_i[10:6];
    assign func = inst_i[5:0]; // 运算类型
    decoder_6_64 dec0(.in(op) , .out(op_d));
    decoder_5_32 dec1(.in(op1) , .out(op1_d));
    decoder_6_64 dec2(.in(sa) , .out(sa_d));
    decoder_5_32 dec3(.in(func) , .out(func_d));
    // 热独码分辨 14 种不同指令
    wire inst_add;
    wire inst_addu;
    wire inst_sub;
    wire inst_subu;
    wire inst_slt;
    wire inst_sltu;
    wire inst_and;
    wire inst_or;
    wire inst_xor;
    wire inst_nor;
    wire inst_sll;
    wire inst_srl;
    wire inst_sra;
    wire inst_lui;
    assign inst_add = op_d[`OpZero]&&sa_d[`SaZero]&&func_d[`FuncAdd];
    assign inst_addu = op_d[`OpZero]&&sa_d[`SaZero]&&func_d[`FuncAddu];
    assign inst_sub = op_d[`OpZero]&&sa_d[`SaZero]&&func_d[`FuncSub];
    assign inst_subu = op_d[`OpZero]&&sa_d[`SaZero]&&func_d[`FuncSubu];
    assign inst_slt = op_d[`OpZero]&&sa_d[`SaZero]&&func_d[`FuncSlt];
    assign inst_sltu = op_d[`OpZero]&&sa_d[`SaZero]&&func_d[`FuncSltu];
    assign inst_and = op_d[`OpZero]&&sa_d[`SaZero]&&func_d[`FuncAnd];
    assign inst_or = op_d[`OpZero]&&sa_d[`SaZero]&&func_d[`FuncOr];
    assign inst_xor = op_d[`OpZero]&&sa_d[`SaZero]&&func_d[`FuncXor];
    assign inst_nor = op_d[`OpZero]&&sa_d[`SaZero]&&func_d[`FuncNor];
    assign inst_sll = op_d[`OpZero]&&op1_d[`Op1Zero]&&func_d[`FuncSll];
    assign inst_srl = op_d[`OpZero]&&op1_d[`Op1Zero]&&func_d[`FuncSrl];
    assign inst_sra = op_d[`OpZero]&&op1_d[`Op1Zero]&&func_d[`FuncSra];
    assign inst_lui = op_d[`OpZero]&&op1_d[`Op1Zero];
    assign aluop_o = (rst == `RstEnable) ? 14'b0 :
        {
            inst_add,
            inst_addu,
            inst_sub,
            inst_subu,
            inst_slt,
            inst_sltu,
            inst_and,
            inst_or,
            inst_xor,
            inst_nor,
            inst_sll,
            inst_srl,
            inst_sra,
            inst_lui
         };
    assign reg1_addr_o = (rst == `RstEnable) ? `ZeroRegAddr : inst_i[25:21];
    assign reg2_addr_o = (rst == `RstEnable) ? `ZeroRegAddr : inst_i[20:16];
    assign reg1_read_o = (rst == `RstEnable) ? `ReadDisable : !(inst_sll || inst_srl || inst_sra || inst_lui);
    assign reg2_read_o = (rst == `RstEnable) ? `ReadDisable : !(inst_lui);
    wire[`RegDataBus]imm;
    assign imm = rst ? `ZeroWord : 
        (inst_lui ? {inst_i[15:0],16'b0} : {27'b0,inst_i[10:6]});
    assign reg1_o = rst ? `ZeroWord :
        (reg1_read_o ? reg1_data_i : imm);
    assign reg2_o = rst ? `ZeroWord : 
        (reg2_read_o ? reg2_data_i : imm);
    assign wd_o = rst ? `ZeroRegAddr : 
        (inst_lui ? inst_i[20:16] : inst_i[15:11]);
    assign wreg_o = rst ? `WriteDisable : `WriteEnable;
endmodule
```



