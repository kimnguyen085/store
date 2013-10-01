package com.demo;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.Servlet;
import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.Gson;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;

/**
 * Servlet implementation class GetName
 */
@WebServlet(urlPatterns="/CountryInformation",name="CountryInformation")

public class GetName extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public GetName() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see Servlet#init(ServletConfig)
	 */
	public void init(ServletConfig config) throws ServletException {
		// TODO Auto-generated method stub
	}

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		doPost(request, response);
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		
//		String name = request.getParameter("Name");
//        String report = "You have insert "+name;
//        response.setContentType("text/plain");
//        PrintWriter out = response.getWriter();
//        out.println("" +  report +  "");
//        out.flush();
//        out.close();
		
		String countryCode = request.getParameter("countryCode");
		 
		if(!countryCode.equals("")){
		
	        PrintWriter out = response.getWriter();
	        response.setContentType("text/html");
	        response.setHeader("Cache-control", "no-cache, no-store");
	        response.setHeader("Pragma", "no-cache");
	        response.setHeader("Expires", "-1");
	 
	        response.setHeader("Access-Control-Allow-Origin", "*");
	        response.setHeader("Access-Control-Allow-Methods", "POST");
	        response.setHeader("Access-Control-Allow-Headers", "Content-Type");
	        response.setHeader("Access-Control-Max-Age", "86400");
	 
	        Gson gson = new Gson();
	        JsonObject myObj = new JsonObject();
	 
	        Country countryInfo = new Country("USA", "United State", "North America", "North America", 77.1, 546546.0);
	        JsonElement countryObj = gson.toJsonTree(countryInfo);
	        if(countryInfo.getName() == null){
	            myObj.addProperty("success", false);
	        }
	        else {
	            myObj.addProperty("success", true);
	        }
	        myObj.add("countryInfo", countryObj);
	        out.println(myObj.toString());
	 
	        out.close();
	        
	        System.out.print(myObj.toString());
		}
	}

}
