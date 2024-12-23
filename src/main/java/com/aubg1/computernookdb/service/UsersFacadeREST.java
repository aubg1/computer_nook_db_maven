/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.aubg1.computernookdb.service;

import com.aubg1.computernookdb.Users;
import jakarta.ejb.Stateless;
import jakarta.json.JsonObject;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.List;

/**
 *
 * @author Brayden Gourlay
 */

@Stateless
@Path("users")
public class UsersFacadeREST extends AbstractFacade<Users> {

    @PersistenceContext(unitName = "my_persistence_unit")
    private EntityManager em;
    
    private static final String SALT = "4";

    public UsersFacadeREST() {
        super(Users.class);
    }
    
    @POST
    @Path("account")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response changePassword(JsonObject passwordData) {
        String email = passwordData.getString("email");
        String existingPassword = passwordData.getString("existingPassword");
        String newPassword = passwordData.getString("newPassword");
        String confirmPassword = passwordData.getString("confirmPassword");

        // Find the user
        Users user = super.find(email);
        if (user == null) {
            return Response.status(Response.Status.NOT_FOUND).entity("User not found").build();
        }

        // Verify existing password
        String hashedExistingPassword = hashPassword(existingPassword);
        if (!hashedExistingPassword.equals(user.getPassword())) {
            return Response.status(Response.Status.UNAUTHORIZED).entity("Incorrect existing password").build();
        }

        // Check if new password and confirm password match
        if (!newPassword.equals(confirmPassword)) {
            return Response.status(Response.Status.BAD_REQUEST).entity("New password and confirm password do not match").build();
        }

        // Hash and set the new password
        String hashedNewPassword = hashPassword(newPassword);
        user.setPassword(hashedNewPassword);

        // Update the user in the database
        try {
            super.edit(user);
            return Response.ok("{\"message\": \"Password changed successfully\"}").build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity("Error updating password").build();
        }
    }

    @POST
    @Override
    @Consumes({MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON})
    public void create(Users entity) {
        super.create(entity);
    }

    @PUT
    @Path("{id}")
    @Consumes({MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON})
    public void edit(@PathParam("id") String id, Users entity) {
        super.edit(entity);
    }

    @DELETE
    @Path("{id}")
    public void remove(@PathParam("id") String id) {
        super.remove(super.find(id));
    }

    @GET
    @Path("{email}")
    @Produces({MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON})
    public Users find(@PathParam("email") String email) {
        return super.find(email);
    }

    @GET
    @Override
    @Produces({MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON})
    public List<Users> findAll() {
        return super.findAll();
    }

    @GET
    @Path("{from}/{to}")
    @Produces({MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON})
    public List<Users> findRange(@PathParam("from") Integer from, @PathParam("to") Integer to) {
        return super.findRange(new int[]{from, to});
    }

    @GET
    @Path("count")
    @Produces(MediaType.TEXT_PLAIN)
    public String countREST() {
        return String.valueOf(super.count());
    }

    @Override
    protected EntityManager getEntityManager() {
        return em;
    }
    
    private String hashPassword(String password) {
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            md.update(SALT.getBytes());
            byte[] bytes = md.digest(password.getBytes());
            StringBuilder sb = new StringBuilder();
            for (byte aByte : bytes) {
                sb.append(Integer.toString((aByte & 0xff) + 0x100, 16).substring(1));
            }
            return sb.toString();
        } catch (NoSuchAlgorithmException e) {
            e.printStackTrace();
            return null;
        }
    }
    
    @POST
    @Path("register")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response registerUser(Users user) {
        try {
            // Check if user already exists
            if (super.find(user.getEmail()) != null) {
                return Response.status(Response.Status.CONFLICT).entity("User already exists").build();
            }

            // Hash the password
            String hashedPassword = hashPassword(user.getPassword());
            user.setPassword(hashedPassword);
            
            super.create(user);
            
            // Return the created user (without the password)
            Users createdUser = new Users(user.getEmail(), user.getName());
            return Response.status(Response.Status.CREATED).entity(createdUser).build();
            
        } catch (Exception e) {
            return Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage()).build();
        }
    }
    
    @POST
    @Path("signin")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response signIn(Users user) {
        Users storedUser = super.find(user.getEmail());
        if (storedUser == null) {
            return Response.status(Response.Status.UNAUTHORIZED).entity("Invalid credentials").build();
        }

        String hashedPassword = hashPassword(user.getPassword());
        if (!hashedPassword.equals(storedUser.getPassword())) {
            return Response.status(Response.Status.UNAUTHORIZED).entity("Invalid credentials").build();
        }
        
        // Successful
        return Response.ok("{\"message\": \"Sign-in successful\"}").build();
    }
}

