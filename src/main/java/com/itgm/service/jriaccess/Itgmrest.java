package com.itgm.service.jriaccess;

import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.HttpEntity;
import org.springframework.http.MediaType;
import org.springframework.http.HttpHeaders;

import com.itgm.domain.User;

import java.io.File;
import java.io.FileOutputStream;
import java.util.Arrays;
import java.util.Date;

public class Itgmrest {

    public static String local = ":8090/ITGMRest2/webresources/jriaccess/";
    public static String urlIP = "http://www.mikeias.net"; ///p/ip-itgm-rest.html
    public static String IP = null;
    public static Long time;
    public static int min_to_update_ip = 5;

    public static void createUser(User user) {
        String codnome = getCodNome(user);
        boolean success = sendText(codnome + "/*/*/*/" + "user.data", "desc/", user.toString());
        System.out.println("Usuario: " + codnome + " criado com " + (success ? "sucesso." : "erro."));
    }

    public static String getCodNome(User user) {
//        return new String(Base64.getEncoder().encodeToString(
//                (user.getLogin()).getBytes()
//        )).replaceAll("\\W", "");
        return user.getLogin(); ////obrigatorio por  deleteUser em UserService:200
    }

    public static String getIP() {
        if (IP == null || (time + (1000 * 60 * min_to_update_ip)) < new Date().getTime()) {
        String pagina = new RestTemplate().getForObject(urlIP, String.class);
        String[] ip = pagina.split("segue o ip para acesso ao ITGM Rest ");
        IP = ip[1].substring(0, ip[1].indexOf(":"));
            time = new Date().getTime();
        }
        return IP;
    }

    public static String getEndereco(){
        return "http://" + getIP() + ":8099/temp/";
    }

    public static String getContent(String url, String subdir) {
        return new RestTemplate().getForObject(
            "http://"
                + getIP()
                + local + "content/"
                + url
                + "?subdiretorio=" + (subdir == null ? "" : subdir),
            String.class);
    }

    public static boolean sendText(String url, String subdir, String content) {
        RestTemplate rt = new RestTemplate();
        String uri = new String(
            "http://" + getIP() + local
                + url
                + "?subdiretorio=" + (subdir == null ? "" : subdir));
        String ret = rt.postForObject(uri, content, String.class);
        return "true".equals(ret);
    }

    public static boolean sendFile(String url, String subdir, Object file) {
        RestTemplate rt = new RestTemplate();
        String uri = new String(
            "http://" + getIP() + local
                + url
                + "?&subdiretorio=" + subdir);
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
        headers.setAccept(Arrays.asList(new MediaType[]{MediaType.TEXT_PLAIN}));

        HttpEntity<byte[]> entity = null;
        try {
            entity = new HttpEntity<byte[]>(
                ((MultipartFile) (file)).getBytes(),
                headers);
        } catch (Exception ex) {
            System.err.println("itgmrest:81 errror entity: " + ex);
        }
        return "true".equals(rt.postForObject(uri, entity, String.class));
    }

    public static File convert(MultipartFile file) {
        File convFile = new File(file.getOriginalFilename());
        try {
            convFile.createNewFile();
            FileOutputStream fos;
            fos = new FileOutputStream(convFile);
            fos.write(file.getBytes());
            fos.close();
        } catch (Exception ex) {
            System.err.println("not saving file: " + ex);
            return null;
        }
        return convFile;
    }

    public static String getFileExt(String fName) {
        return fName == null ? fName : (fName.contains(".") ? ("." + fName.replaceAll("^.*\\.", "")) : "");
    }

    public static String publicFile(
        String usuario,
        String projeto,
        String cenario,
        String diretorio,
        String subdiretorio,
        String file) {
        RestTemplate rt = new RestTemplate();
        String ret = rt
            .getForObject(
                "http://" + getIP() + local
                    + "file/"
                    + usuario + "/"
                    + projeto + "/"
                    + cenario + "/"
                    + diretorio + "/"
                    + file + (subdiretorio == null ? "" : "?subdiretorio=" + subdiretorio), String.class);
        return (ret != null && ret.length() > 0 && !ret.isEmpty() && !ret.startsWith("error:")) ? ret : null;
    }

    public static boolean createNew(User user,
                                    String projeto,
                                    String cenario,
                                    String diretorio,
                                    String subdiretorio,
                                    String conteudo) {
        String codnome = getCodNome(user);
        return sendText( ///codnome+ "/*/*/*/" + "user.data", "desc/",
            codnome
                + "/" + projeto
                + "/" + cenario
                + "/" + diretorio + "/" + ".info", subdiretorio, conteudo);
    }

    public static boolean createNewFile(String user,
                                    String projeto,
                                    String cenario,
                                    String diretorio,
                                    String subdiretorio,
                                    String nomeDoArquivo,
                                    String conteudo) {
        return sendText( ///codnome+ "/*/*/*/" + "user.data", "desc/",
            user
                + "/" + projeto
                + "/" + cenario
                + "/" + diretorio + "/" + nomeDoArquivo, subdiretorio, conteudo);
    }

    public static String listFiles(String path) {
        return new RestTemplate().getForObject(
            "http://" + getIP() + local
                ///list/{usuario}/{projeto}/{cenario}/{diretorio}
                + "list/" + path,
            String.class);
    }

    public static void removeDIR(
        String usuario,
        String projeto,
        String cenario,
        String diretorio,
        String file,
        String subdiretorio) {

        String path = usuario;

        if (projeto == null && cenario == null && diretorio == null && file == null) {
            path = "usuario/" + usuario;
        } else if (cenario == null && diretorio == null && file == null) {
            path = "projeto/" + usuario + "/" + projeto;
        } else if (diretorio == null && file == null) {
            path = "cenario/" + usuario + "/" + projeto + "/" + cenario;
        } else if (file == null) {
            path = "diretorio/" + usuario + "/" + projeto + "/" + cenario + "/" + diretorio;
        } else {
            path = "file/" + usuario + "/" + projeto + "/" + cenario + "/" + diretorio + "/" + file;
        }
        new RestTemplate().delete("http://" + getIP() + local + path
            + "?subdiretorio=" + (subdiretorio != null ? subdiretorio : ""));
    }

    public static void executarBatch(String endereco, String codigo){
        String query = "?&parametros=BATCH&parametros=log.txt&parametros=DEBUG&memoria=20&cpu=1&disco=20&salvar=true";
        try {
            new RestTemplate().put(
                "http://" + getIP() + local + endereco + query,
                java.net.URLEncoder.encode(codigo, "UTF-8")
            );
        }catch (Exception ex){

        }
    }

    public static String criarCompartilhamento(String origem, String destino){
        RestTemplate rt = new RestTemplate();
        String uri = new String(
            "http://" + getIP() + local + "compartilhamento/"
                + "?origem=" + origem
                + "&destino=" + destino);
      return rt.getForObject(uri, String.class);
    }

    public static String receberCompartilhamento(String usuario, String token){
        RestTemplate rt = new RestTemplate();
        String uri = new String(
            "http://" + getIP() + local + "compartilhado/"
                + usuario + "/"
                + token);
        return rt.getForObject(uri, String.class);
    }

    public static boolean createFileCompartilhamento(
        String user,
        String token,
        String local
    ){
        String conteudo = local + "\n\n";
        return createNewFile(
            user,
            "*",
            "*",
            "*",
            "share/" + token + "/",
            token,
            conteudo);
    }

}
