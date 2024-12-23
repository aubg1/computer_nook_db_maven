/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.aubg1.computernookdb.service;

import com.aubg1.computernookdb.Orders;
import com.aubg1.computernookdb.Users;
import jakarta.ejb.Stateless;
import jakarta.json.JsonObject;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;
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
import java.util.List;

/**
 *
 * @author Brayden Gourlay
 */

@Stateless
@Path("orders")
public class OrdersFacadeREST extends AbstractFacade<Orders> {

    @PersistenceContext(unitName = "my_persistence_unit")
    private EntityManager em;

    public OrdersFacadeREST() {
        super(Orders.class);
    }

    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response create(JsonObject orderData) {
        try {
            String customerInfo = orderData.getString("customerInfo");
            String orderItems = orderData.getString("orderItems");
            String userEmail = orderData.getString("userEmail");

            TypedQuery<Users> query = em.createQuery("SELECT u FROM Users u WHERE u.email = :email", Users.class);
            query.setParameter("email", userEmail);
            List<Users> users = query.getResultList();

            if (users.isEmpty()) {
                return Response.status(Response.Status.BAD_REQUEST).entity("User not found").build();
            }

            Users user = users.get(0);
            Orders entity = new Orders(customerInfo, orderItems, user);

            super.create(entity);
            return Response.status(Response.Status.CREATED).entity(entity).build();
            
        } catch (Exception e) {
            return Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage()).build();
        }
    }

    @PUT
    @Path("{id}")
    @Consumes({MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON})
    public void edit(@PathParam("id") Integer id, Orders entity) {
        super.edit(entity);
    }

    @DELETE
    @Path("{id}")
    public void remove(@PathParam("id") Integer id) {
        super.remove(super.find(id));
    }

    @GET
    @Path("{id}")
    @Produces({MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON})
    public Orders find(@PathParam("id") Integer id) {
        return super.find(id);
    }
    
    @GET
    @Path("user/{email}")
    @Produces({MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON})
    public List<Orders> findByUserEmail(@PathParam("email") String email) {
        TypedQuery<Orders> query = em.createQuery("SELECT o FROM Orders o WHERE o.userEmail.email = :email", Orders.class);
        query.setParameter("email", email);
        return query.getResultList();
    }

    @GET
    @Override
    @Produces({MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON})
    public List<Orders> findAll() {
        return super.findAll();
    }

    @GET
    @Path("{from}/{to}")
    @Produces({MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON})
    public List<Orders> findRange(@PathParam("from") Integer from, @PathParam("to") Integer to) {
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
    
}