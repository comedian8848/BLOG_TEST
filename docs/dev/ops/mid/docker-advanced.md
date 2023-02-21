---
title: Docker è¿›é˜¶
date: 2021-5-17
categories:
  - WebApp
tags:
  - Middleware
---

## è¿›é˜¶å‘½ä»¤

æŒ‚è½½æ•°æ®å·

~~~bash
docker run -v /myDataVolume:/containerVolume é•œåƒåç§°
~~~

æ‹·è´æŒ‡å®šæ–‡ä»¶åˆ°æŒ‡å®šç›®å½•

~~~
docker cp å®¹å™¨å:/containerVolume/  /myDataVolume/
~~~

~~~bash
docker cp /myVolume/  å®¹å™¨å:/containerVolume/
~~~

ç›‘å¬å®¹å™¨çŠ¶æ€

~~~bash
docker stats --no-stream --format "{}" å®¹å™¨å
~~~

- --no-streamï¼šä¸æŒç»­è¾“å‡ºï¼Œå³æ‰“å°å½“å‰çŠ¶æ€
- --formatï¼šè‡ªå®šä¹‰è¾“å‡ºæ ¼å¼ï¼ˆjsonï¼‰

é‡è¿å®¹å™¨

~~~bash
exec -it å®¹å™¨å /bin/bash
~~~

å°†Webé¡¹ç›®æŒ‚åœ¨tomcatå®¹å™¨å†…

- å¯åŠ¨ tomcat å®¹å™¨ï¼Œå°† war åŒ…å¤åˆ¶è¿›å®¹å™¨ /usr/local/tomcat/webapps/ ç›®å½•å³å¯
- å®¹å™¨ä¼šè‡ªåŠ¨è§£å‹waråŒ…ï¼Œç„¶åé€šè¿‡ ip:8080/NEUQHelper å³å¯è®¿é—®é¡¹ç›®

~~~bash
docker cp /java/NEUQHelper.war de9dc1076633:/usr/local/tomcat/webapps/
~~~

## Docker+

### MySQL

1ã€æ‹‰å–é•œåƒ

~~~bash
docker pull mysql:5.7
~~~

- ä¹Ÿå¯æŒ‡å®šå…¶ä»–ç‰ˆæœ¬

2ã€ç”Ÿæˆå®¹å™¨

~~~bash
docker run -it --name My-mysql -p 13306:3306 -e MYSQL_ROOT_PASSWORD=123456 84164b03fa2eï¼ˆé•œåƒidï¼‰
~~~

- --name è‡ªå®šä¹‰è®¾ç½®å®¹å™¨åç§°

- -p åä¸ºæ˜ å°„ç«¯å£ ä»linuxä¸Šçš„ 13306 æ˜ å°„ä¸ºå®¹å™¨ä¸­çš„ 3306ç«¯å£

- -e åè®¾ç½® mysql ç™»å½•å¯†ç 

3ã€è¿æ¥å®¹å™¨

~~~bash
docker exec -it 064c6bea326d /bin/bash
~~~

4ã€ç™»å½•

~~~bash
mysql -h localhost -u root -p
~~~

- è¾“å…¥å¯†ç ï¼Œç™»å½•æˆåŠŸ


### Tomcat éƒ¨ç½² war åŒ…

1ã€æ‹‰å–é•œåƒ

~~~bash
docker pull tomcat
~~~

2ã€ç”Ÿæˆå®¹å™¨

~~~bash
docker run -it -d --name mycat -p 8080:8080 tomcat
~~~

- --name è‡ªå®šä¹‰è®¾ç½®å®¹å™¨åç§°

- -d åå°å¯åŠ¨

- -p è®¾ç½®ç«¯å£ï¼ˆ8080ï¼‰

3ã€æœ¬åœ°è®¿é—®tomcat

~~~bash
localhost:8080
~~~

4ã€Issue

é€šå¸¸æƒ…å†µä¸‹ï¼Œ8080ç«¯å£è®¿é—®çš„é¦–é¡µæ‰¾ä¸åˆ°ï¼Œå³æ˜¾ç¤º404ï¼ŒåŸå› æ˜¯tomcatå®¹å™¨ä¸­é»˜è®¤ROOTç›®å½•åœ¨`webapps.dist`æ–‡ä»¶å¤¹ä¸­ï¼Œè€Œ`webapps`ç›®å½•ä¸ºç©ºï¼Œä½†é…ç½®æ–‡ä»¶åˆçº¦å®šåœ¨ `webapps/ROOT/`ä¸­å»æ‰¾é¦–é¡µ`index.html`ï¼Œäºæ˜¯æŠ¥é”™

- å…¶å®ä»–è¿™æ ·æ˜¯ä¸ºäº†æ–¹ä¾¿ç»™ä½ æ”¾è‡ªå·±çš„ç½‘é¡µ

è§£å†³åŠæ³•ï¼š

è¿›å…¥tomcatå®¹å™¨

~~~bash
docker exec -it mycat /bin/bash
~~~

å°†`webapps.dist`ç›®å½•åä¿®æ”¹ä¸º`webapps`

~~~bash
mv webapps webapps1
mv webapps.dist webapps
~~~

ctrl+p+qé€€å‡ºå®¹å™¨ï¼Œé‡æ–°è®¿é—®8080ç«¯å£

### ProjectorDocker

1ã€æ‹‰å–é•œåƒ

~~~bash
docker pull projectorimages/projector-idea-c
~~~

2ã€è¿è¡Œå®¹å™¨

~~~bash
docker run --rm -p 8887:8887 -it projectorimages/projector-idea-c
~~~

- æˆ‘å°è¯•æŒ‚è½½ä¸€ä¸ªç›®å½•ï¼Œç›®å½•ä¸‹æ”¾äº†jdk1.8ä»¥åŠä¸€ä¸ªé¡¹ç›®æ–‡ä»¶ï¼Œä¸å¹¸çš„æ˜¯ï¼Œé…ç½®jdk1.8åï¼ŒideaæŠ¥é”™æ— æ³•ä¿®æ”¹é…ç½®ï¼Œåœ¨æ•°æ®å·ä¸­åˆ›å»ºé¡¹ç›®åŒæ ·ä¸æˆåŠŸï¼ŒæŠ¥é”™â€œread onlyâ€ï¼Œå³ä½¿æˆ‘è®¾ç½®äº†è¯»å†™æƒé™


3ã€é€šè¿‡ip:8887è®¿é—®idea

4ã€å°†å®¹å™¨å†…æ•°æ®æ‹·è´

~~~bash
docker cp å®¹å™¨å:ç›®å½• å®¿ä¸»æœºç›®å½•
~~~

## Docker API å¼€å‘

[DockerClient API Docs](https://docs.docker.com/engine/api/)

> è°ƒç”¨`DockerClient API`ï¼Œç”¨Javaä»£ç è¿œç¨‹åˆ›å»ºå¹¶ä½¿ç”¨å®¹å™¨

### DockerRunner

å¯¼åŒ…å¹¶è®¾ç½®å†…ç½®å±æ€§

~~~java
package com.docker;

import com.spotify.docker.client.*;
import com.spotify.docker.client.messages.*;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.URI;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Map;

public class DockerRunner implements Runner {

    private final String DOCKER_CONTAINER_WORK_DIR = "/usr/codeRun";
    private final String getMemory = "sh -c docker stats --no-stream --format \"memory:{{.MemUsage}}\"";;
    private Map<Integer, String> imageMap = new HashMap<>();
    private DockerClient docker;
    private String id;
    //private List<Image> Images = new ArrayList<>();
    private ContainerConfig containerConfig;
}
~~~

åˆå§‹åŒ– docker å®¹å™¨

~~~java
//åˆå§‹åŒ–
public long init(int type) {

    long startTime = System.currentTimeMillis();
    System.out.println("å¼€å§‹åˆå§‹åŒ–docker");

    imageMap.put(25695, "hello-world:latest");
    imageMap.put(10730, "gcc:7.3");
    imageMap.put(20800, "openjdk:8");
    imageMap.put(21100, "openjdk:11");
    imageMap.put(30114, "golang:1.14");

    System.out.println("å¼€å§‹åˆå§‹åŒ–");
    try{
        //åˆå§‹åŒ–dockerä»£ç†
        docker = DefaultDockerClient.builder()
                .uri(URI.create("https://39.106.160.174:2375"))
                .dockerCertificates(new DockerCertificates(Paths.get("src/main/resources/certs")))
                .build();
        System.out.println("docker_clientåˆå§‹åŒ–æˆåŠŸ");

         //è®°å½•å·²æœ‰é•œåƒä¿¡æ¯
         /*
         System.out.println("å¼€å§‹è®°å½•docker_client_images");
         Images = docker.listImages();
         Iterator<Image> i = Images.listIterator();
         while(i.hasNext()){
             System.out.println(i.next());
         }
         System.out.println("imagesè®°å½•å®Œæ¯•");
         */

         //å¼€å§‹åˆ›å»ºå®¹å™¨
        System.out.println("å¼€å§‹åˆ›å»ºdockerå®¹å™¨");
        containerConfig = ContainerConfig.builder()
                 //è®©å®¹å™¨æŒç»­å¼€å¯
                .openStdin(true)
                 //æ·»åŠ å·
                .addVolume(DOCKER_CONTAINER_WORK_DIR)
                 //è®¾ç½®dockerå·¥ä½œå·
                .workingDir(DOCKER_CONTAINER_WORK_DIR)
                .image(imageMap.get(type))
                .build();
        ContainerCreation creation = docker.createContainer(containerConfig);

        // è®°å½•å®¹å™¨idï¼Œç”¨äºä¹‹åè¿æ¥
        id = creation.id();

        // æ‰“å°å®¹å™¨ä¿¡æ¯
        final ContainerInfo info = docker.inspectContainer(id);
        System.out.println(info.toString());


        System.out.println("å®¹å™¨åˆ›å»ºå®Œæ¯•");
    }catch (Exception e) {
        e.printStackTrace();
    }finally {
        long endTime = System.currentTimeMillis();
        return endTime - startTime;
    }
}
~~~

åœæ­¢å¹¶é”€æ¯å®¹å™¨

~~~java
//åœæ­¢å®¹å™¨ï¼šè®°å½•åœæ­¢æ—¶é—´
public long kill(){
	long startTime = System.currentTimeMillis();
	try{
        //åœæ­¢å®¹å™¨
        docker.stopContainer(id, 0);
        System.out.println("åœæ­¢å®¹å™¨æˆåŠŸ");
        //ç§»é™¤å®¹å™¨
        docker.removeContainer(id);
        System.out.println("å·²ç§»é™¤å®¹å™¨");
        //å…³é—­dockerä»£ç†
        docker.close();
        System.out.println("dockerä»£ç†å·²å…³é—­");
    }catch(Exception e) {
        e.printStackTrace();
    }finally{
        System.out.println("æœ¬æ¬¡åˆ¤é¢˜ç»“æŸï¼Œæ­£åœ¨è¿”å›ç»“æœ...");
        long endTime = System.currentTimeMillis();
        return endTime - startTime;
    }
}
~~~

è¦ƒè¾‰å­¦é•¿çš„ test æ–¹æ³•

~~~java
//æµ‹è¯•è¿è¡Œ
public HashMap<String, Object> test(int imageType){
    init(imageType);
    HashMap<String, Object> res = new HashMap<String, Object>();
    try{
        //å¯åŠ¨container
        docker.startContainer(id);


        //å¼€å§‹åœ¨å®¹å™¨å†…éƒ¨æ‰§è¡Œå‘½ä»¤æ‰§è¡Œ
        System.out.println("æ­£åœ¨æ‰§è¡Œå‘½ä»¤...");

        //å°†æ–‡ä»¶æ‹·è´è‡³å®¹å™¨å†…éƒ¨
        docker.copyToContainer(new java.io.File("src/main/resources/myCode").toPath(), id, "/usr/codeRun/");


        //å¼€å§‹æ‰§è¡Œ
        final String[] command1 = {"javac", "Solution.java"};
        ExecCreation execCreation1 = docker.execCreate(
                id, command1, DockerClient.ExecCreateParam.attachStdout(),
                DockerClient.ExecCreateParam.attachStderr());

        final String[] command2 = {"java", "Solution"};
        ExecCreation execCreation2 = docker.execCreate(
                id, command2, DockerClient.ExecCreateParam.attachStdout(),
                DockerClient.ExecCreateParam.attachStderr());

        //è·å–å‘½ä»¤çš„è¿è¡Œç»“æœ
        final LogStream output1 = docker.execStart(execCreation1.id());
        final String execOutput1 = output1.readFully();
        final LogStream output2 = docker.execStart(execCreation2.id());
        final String execOutput2 = output2.readFully();

        //è·å–è¿è¡ŒçŠ¶æ€
        final ExecState state1 = docker.execInspect(execCreation1.id());
        final ExecState state2 = docker.execInspect(execCreation2.id());

        //ç­‰å¾…è¿è¡Œå®Œæˆ
        System.out.println("æ­£åœ¨è¿è¡Œ...");
        while(state1.running()){};
        while(state2.running()){};

        String ans = execOutput2.substring(0, execOutput2.indexOf('_'));
        String time = execOutput2.substring(ans.length()+1);

        //å°†è¿è¡Œç»“æœå­˜äºresï¼ˆmapï¼‰ä¸­è¿”å›
        res.put("ç¬¬ä¸€æ¡å‘½ä»¤çš„è¿è¡Œç»“æœ", execOutput1);
        res.put("ç¬¬ä¸€æ¡å‘½ä»¤çš„è¿”å›å€¼", state1.exitCode());
        res.put("ç¬¬äºŒæ¡å‘½ä»¤çš„è¿è¡Œç»“æœ", ans);
        res.put("ç¬¬äºŒæ¡å‘½ä»¤çš„è¿”å›å€¼", state2.exitCode());
        res.put("ç¨‹åºè¿è¡Œæ—¶é—´", time);

        System.out.println("æ‰§è¡Œç»“æŸ");

    }catch(Exception e) {
        e.printStackTrace();
    }finally {
        kill();
    }
    return res;
}
~~~

æˆ‘çš„ run æ–¹æ³•

~~~java
//å»é™¤äº†æ—¶é—´çš„å•ä½msï¼ˆä¸ºäº†ç´¯è®¡è®¡ç®—æ€»æ—¶é—´ï¼‰
public HashMap<String, Object> run(String[][] commandLine, int imageType, long timeLimit, long memoryLimit){
    HashMap<String, Object> res = new HashMap<>();
    res.put("åˆ›å»ºå®¹å™¨æ—¶é—´", init(imageType) + "ms");
    try{
        //è¿æ¥container
        System.out.println("è¿æ¥å®¹å™¨");
        docker.startContainer(id);

        //å°†æœ¬åœ°æ–‡ä»¶å¤¹å…±äº«è‡³å®¹å™¨å†…éƒ¨
        docker.copyToContainer(new java.io.File
                ("src/main/resources/myCode").toPath(), id, "/usr/codeRun/");


        //å¼€å§‹åœ¨å®¹å™¨å†…éƒ¨æ‰§è¡Œå‘½ä»¤æ‰§è¡Œ
        //ç¼–è¯‘javaæ–‡ä»¶
        //commandLine[0]æ˜¯ç¼–è¯‘å‘½ä»¤ï¼ŒcommandLine[1]æ˜¯æ‰§è¡Œå‘½ä»¤
        System.out.println("å¼€å§‹ç¼–è¯‘...");
        final ExecCreation execCompile = docker.execCreate(
                id, commandLine[0], DockerClient.ExecCreateParam.attachStdout(),
                DockerClient.ExecCreateParam.attachStderr());
        ExecState compileState = docker.execInspect(execCompile.id());
        //æ‰§è¡Œç¼–è¯‘å‘½ä»¤
        docker.execStart(execCompile.id());
        while(compileState.running()){};
        System.out.println("ç¼–è¯‘æˆåŠŸ");



        //ç¼–è¯‘å®Œæˆï¼Œæ‰§è¡Œclassæ–‡ä»¶
        final ExecCreation execCreation = docker.execCreate(
                id, commandLine[1], DockerClient.ExecCreateParam.attachStdout(),
                DockerClient.ExecCreateParam.attachStderr());

         //è·å–å‘½ä»¤çš„è¿è¡Œç»“æœ
        LogStream output = docker.execStart(execCreation.id());
        String execOutput = output.readFully();



        //è·å–è¿è¡ŒçŠ¶æ€
        ExecState state = docker.execInspect(execCreation.id());


        //ç­‰å¾…è¿è¡Œå®Œæˆ
        System.out.println("æ­£åœ¨è¿è¡Œç¨‹åº..");

        while(state.running()){};
        System.out.println("è¿è¡Œç»“æŸ");


        //è·å–è¿è¡Œç»“æœ
        //String ans = execOutput;
        String ans = execOutput.substring(0, execOutput.indexOf('_'));


        //è·å–è¿è¡Œæ—¶é—´
        //String time = execOutput;
        String time = execOutput.substring(ans.length()+1);


        // Inspect container
        /*
        final ContainerInfo info = docker.inspectContainer(id);
        String getMemory = "bash\t-c\tdocker\tstats\t--no-stream";
        ExecState state1 =  docker.execInspect("getMemory");
        String memory = state1.toString();

        //è·å¾—å®¹å™¨å†…å­˜å ç”¨
        ContainerStats containerstats = docker.stats(id);
        MemoryStats memorystats = containerstats.memoryStats();
        long memory = memorystats.usage()/1024;
        */
        //è·å¾—å†…å­˜ä½¿ç”¨
        /*
        TopResults set = docker.topContainer(id);
        set.processes();
        long memory = docker.stats(id).memoryStats().usage()/1024;
        */

        //åœ¨å®¹å™¨å¤–ï¼Œå³æœåŠ¡å™¨ä¸»æœºä¸Šæ‰§è¡Œshellå‘½ä»¤ docker stats --no-stream --format "memory:{{.MemUsage}}" + å®¹å™¨idï¼Œè·å–å®¹å™¨å†…å­˜å ç”¨
        Process pro = Runtime.getRuntime().exec(getMemory + id);
        BufferedReader buf = new BufferedReader(new InputStreamReader(pro.getInputStream()));
        StringBuffer mem = new StringBuffer();
        String str;
        while ((str = buf.readLine()) != null) {
            mem.append(str);
        }
        String memory = "0MiB";
        if(mem.length()!=0){
            memory = mem.substring(mem.indexOf(":"), mem.indexOf("/"));
        }



        res.put("è¿è¡Œç»“æœ", ans);
        res.put("è¿è¡Œæ—¶é—´", time + "ms");
        res.put("å†…å­˜ä½¿ç”¨", memory);


        //è®°å½•æ˜¯å¦è¶…æ—¶
        if(Integer.parseInt(time) > timeLimit) {
            res.put("è¶…æ—¶", true);
        } else{
            res.put("è¶…æ—¶", false);
        }

        if(Integer.parseInt(memory.substring(0, memory.indexOf("M"))) > memoryLimit){
            res.put("è¶…å‡ºå†…å­˜é™åˆ¶", true);
        }else{
            res.put("è¶…å‡ºå†…å­˜é™åˆ¶", false);
        }


    }catch(Exception e) {
        e.printStackTrace();
    }finally {
        res.put("åœæ­¢å®¹å™¨æ—¶é—´", kill() + "ms");
    }
    return res;
}
~~~

### åˆ¤é¢˜æµ‹è¯•

~~~java
package com.docker;

import java.util.HashMap;

// 10730 gcc:7.3 |  20800 openjdk:8 | 21100 openjdk:11 | 30114 golang:1.14

public class RunnerTest {
    public static void main(String[] args) {

        DockerRunner docker = new DockerRunner();
        String[][] command1 = {{"javac", "HelloWorld.java"}, {"java", "HelloWorld"}};
        String[][] command2 = {{"gcc", "main.c", "-o", "main", "main"}};
        String[][] command3 = {{"javac", "-d", ".", "Solution.java"}, {"java", "test/Solution"}};

        HashMap<String, Object> res = docker.run(command3,20800, 2, 50);

        System.out.println();
        for(String str: res.keySet()){
            if(str == "è¿è¡Œç»“æœ"){
                System.out.println("\nè¿è¡Œç»“æœï¼š" + res.get(str));
            }else{
                System.out.print(str + ":" + res.get(str) + "    ");
            }
        }
        System.out.println("\nfinished!");

    }
}


//æµ‹è¯•åˆ›å»ºã€è¿è¡Œã€åœæ­¢æ—¶é—´
/*
        long initTime = Integer.parseInt(res.get("åˆ›å»ºå®¹å™¨æ—¶é—´").toString());
        long stopTime = Integer.parseInt(res.get("åœæ­¢å®¹å™¨æ—¶é—´").toString());
        long runningTime = Integer.parseInt(res.get("è¿è¡Œæ—¶é—´").toString());

        for (int i = 0; i < 499; i++) {
            HashMap<String, Object> temp = docker.run(command1, 20800, 0, 252);
            initTime += Integer.parseInt(temp.get("åˆ›å»ºå®¹å™¨æ—¶é—´").toString());
            stopTime += Integer.parseInt(temp.get("åœæ­¢å®¹å™¨æ—¶é—´").toString());
            runningTime += Integer.parseInt(temp.get("è¿è¡Œæ—¶é—´").toString());
            System.out.println(i+2);
        }
        System.out.println("æ€»åˆ›å»ºå®¹å™¨æ—¶é—´ï¼š" + initTime + "   æ€»è¿è¡Œæ—¶é—´ï¼š" + runningTime + "    æ€»åœæ­¢å®¹å™¨æ—¶é—´ï¼š" + stopTime);
        System.out.println();
*/
~~~

### æµ‹è¯•ç”¨ä¾‹

1ã€HelloDocker

`HelloDocker.java â€”â€”> comandLine1`

~~~java
import java.io.BufferedReader;

import java.io.InputStreamReader;


public class HelloWorld{
	public static void main(String[] args){

		long startTime = System.currentTimeMillis();

		int j = 1;
		for(int i = 1; i < 12000; i++){
			j *= i;
		}
		System.out.println("Hello Docker!");		

		long endTime = System.currentTimeMillis();
		long time = endTime - startTime;
		System.out.print("_" + time);
	}
}
~~~

ç»“æœ

~~~shell
å¼€å§‹åˆå§‹åŒ–docker
å¼€å§‹åˆå§‹åŒ–
01:15:21.302 [main] DEBUG com.spotify.docker.client.DockerCertificates - Generated private key from spec using the 'RSA' algorithm
01:15:22.596 [main] DEBUG com.spotify.docker.client.DockerConfigReader - Using configfile: C:\Users\NorthBoat\.docker\config.json
docker_clientåˆå§‹åŒ–æˆåŠŸ
å¼€å§‹åˆ›å»ºdockerå®¹å™¨
å®¹å™¨åˆ›å»ºå®Œæ¯•
è¿æ¥å®¹å™¨
01:15:25.805 [main] INFO com.spotify.docker.client.DefaultDockerClient - Starting container with Id: 4a2bebba027acbebc81faf7451afb481dceeeecfdf8dfe1f2fb0d6af8f86bdc1
å¼€å§‹ç¼–è¯‘...
ç¼–è¯‘æˆåŠŸ
æ­£åœ¨è¿è¡Œç¨‹åº..
è¿è¡Œç»“æŸ
åœæ­¢å®¹å™¨æˆåŠŸ
å·²ç§»é™¤å®¹å™¨
dockerä»£ç†å·²å…³é—­
æœ¬æ¬¡åˆ¤é¢˜ç»“æŸï¼Œæ­£åœ¨è¿”å›ç»“æœ...

è¶…æ—¶:false    è¶…å‡ºå†…å­˜é™åˆ¶:false    åˆ›å»ºå®¹å™¨æ—¶é—´:5174ms    å†…å­˜ä½¿ç”¨:0MiB    è¿è¡Œæ—¶é—´:1ms    åœæ­¢å®¹å™¨æ—¶é—´:704ms    
è¿è¡Œç»“æœï¼š
Hello Docker!


finished!

Process finished with exit code 0
~~~

2‡m>oíeÌÑE½ü£:K…I+÷N	^x$œ¥xEÙ÷”_Æ¢ÿ hßi>ñjÍáÛÓwáÀntÛÙ.àºšŞXYìdhÁ Å 9q„”‘ıÒçÖ¾¸¸•`E|¯Ú¹-–f9 `Š¬÷é4aî­¶ÖIÑÈµ¶b'–ŸÄ08áK36W''¿•ä!t4…O)v$„©bXs€>l€°äVPŒ©%îÌ§É9]luĞ]OåœÏ42Éö©,ïâiÍÄÅTK+»qµñqó(¥t3K1s;ÀQ@JˆŠ‘ ?)P8#4ß‡zÍ¥—‰´[«‹{]FÚ=F5•öÇ²ºTdV†@ØÜ˜c»i ã®+é]ROøâ$z¯†ãGğµ½»]ßhÓêOs$Ó\È²ı™dpJÆ€ù¡A·tc-¸ åZkg©0„$ìp_¼^–zÅ¼ú¤r‹]6ú;‡ŒÎË,–³0‚epd1
ÀFÀ.yëÓxçNŠÔÍ¤»Ü:ëyv–‘É,0Û<ls¾v«Jèê£ ‘òçÊu[5´ñÅ”W7š:ÎÆ+ù‘$}F9dVInÖ+òü£95Şx“Qû}‡ü$3¬RÌ-mì5)&Û3Èe!€ÛTË ¤|Ã#8¯')Ê´]´ê}\¢¨JÔğ—¸>{Èêñ>Cmm¾ljàpHã «Ôõª|‹ŒÌD» #<‡ œš¥}vÿ l®¼³º<Hû¥º.íÆ%]Ù”ŠØ\`u“qt·F%:7`’¾K†Q¸³Ù\ [###¢³VØÁÉBm=Ë:ˆhİ–>FòÎ‘,d¹>„’  ‚N:æ©¸‹ìÈ0ÄhCNïæ]aV7vv$±;N{1Û$²¬ò4Šcã´eäYV+½1ÎA+$U£YÆ«æÜHÄE|µ@Ä Ä“€¿1$ó÷O+µ'd’Ôçöœ³vÜÕûD8ò¥Œ¾÷P…?Ö…CT°*W9<géú|wIuvÆ%ŠÖhìäi%HæL®ÈQŞUÚCH»‚°PHÈÎAˆO³5Áµ¶IŒW7ˆ„2Çà>ô›=Jõ†'°bºŠİÚ,ğ5 	 kØ%••£`™Ú§#O 3ræùe{„Z^ôˆoBC"I³0F†hü¸ü”b¡q…;É†Ç8¬õ¾F7	öyehG–X<íÄ®ãøp8 uã¾5…›Ç-Ü26^;¥·¤ÁÁ0;2ÉŒdW-Á!°B“Âñ²¤sC¸¦ÍÆ&Wl…E!”`äœüt57orZ¨ß<_È©lëur2Àˆ¤Ü›@\åw|ä`t>Â’K.àKk—<>cÃ-Ú“q˜ÅK¬AÙ¸àä’ Œv5^|jè?Õ¼E”Dù_— Œ`àpI,Aiæ<LvDÓ,’ªÇ‰ä˜Æ‹ºF`€8àM+§Ôws­¨ÛvKaäÈ&FÚÒOİ1†P¹ãÈéĞ²w!¤¸-ÂåÎ›c€±w@ÀÜÌø€	ïœÕ“LÉ…Èø¸ ¸†–'Ï wâ‘¬Ib"†!'—»¬—R1RÙH²N9#wäU'fµ3÷¢í{¢hmDóÇ˜–É¸¹’@Z+‚PA2á¤Ş.	å€æ©Øß8·RŞcA,B_‘ÁÜTƒÏ.ƒ–;3V£b¥d•š4M*£lŒ©BØ ùğ:ŒåŠ±ÉI¥³E£Eæûs1«HNAØµp‹NMTœ]»•ïA&¶*´ñÜ¬­çˆã—”´'Ìy
â6_âU_¼Tı;t:†–s¯öuúÜÀ®f¶\y¬ÑâP‰$¸g`FqÒ®h¶¶6–òÍ|mË[,67ÍwÙá3Ç)’ØL®S‰8ûÀŠÓÀ×2•ÓáX¢·Œ¢Åg¶UEPIxƒ´“Œ€Iä‘~¤FnHë¸Ã`–è±ìÈT¤Æá€rq€8#¥N–Ê|Ë¹M¤…_t2•˜öŒˆÉf1ƒ_í[%‚ñfŠ	@ŠXï s$¶ÛIÈˆ§åf à±ç<Œ\ÅokºFÖğd¤..â@bCd±\ç ”äwœ“rM”½A÷A|«wo;ÈşŒÓËçy’V ° 0Ïğ ÇN:&•mãW%u®Wx»RÌ¤£´)È'®09âBÑ\ËnÏ-
±šg•y $#ªòğøÈ |§ÔâÄÖ÷1 „›s¾UG‰TT "XØK+p28Ú-r»îbâ¹Ÿ+!Œ	cLQ±x–[»Q´la¹î%I @Häf¤¶í	OG¶–bçÏiVER¡X•·É ãæn³ S]v·¼‚Úç"'¹ãÎc‘CL
);ò„¡ ¤‘‘šè4Fñ²Ñ[<±Ê$‘•äŠ8á]ÑG?<‡1üÀ(Ü	àn1M7mKönIw9It,Ê³èñ]­ˆAk-½ª(˜«VHØ·Ê·À†
ONŞ¬zM½´LÉoozÍ$öQ[‹…†üµ1B¥·0Ñ‰v$–ÇpÕè6ÚE®™