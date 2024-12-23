/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.aubg1.computernookdb.service;

import com.aubg1.computernookdb.Reviews;
import com.aubg1.computernookdb.Products;
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
import java.util.Date;
import java.util.List;

/**
 *
 * @author Brayden Gourlay
 */

@Stateless
@Path("reviews")
public class ReviewsFacadeREST extends AbstractFacade<Reviews> {

    @PersistenceContext(unitName = "my_persistence_unit")
    private EntityManager em;

    public ReviewsFacadeREST() {
        super(Reviews.class);
    }
    
    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response createReview(JsonObject reviewData) {
        try {
            String email = reviewData.getString("email");
            int productId = reviewData.getInt("productId");
            int rating = reviewData.getInt("rating");
            String reviewText = reviewData.getString("reviewText");

            Users user = em.find(Users.class, email);
            if (user == null) {
                return Response.status(Response.Status.BAD_REQUEST).entity("User not found").build();
            }

            Products product = em.find(Products.class, productId);
            if (product == null) {
                return Response.status(Response.Status.BAD_REQUEST).entity("Product not found").build();
            }

            Reviews review = new Reviews();
            review.setUserEmail(user);
            review.setProductId(product);
            review.setRating(rating);
            review.setReviewText(reviewText);
            review.setReviewDate(new Date());

            super.create(review);

            return Response.status(Response.Status.CREATED).entity(review).build();
        } catch (Exception e) {
            return Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage()).build();
        }
    }

    @POST
    @Override
    @Consumes({MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON})
    public void create(Reviews entity) {
        super.create(entity);
    }

    @PUT
    @Path("{id}")
    @Consumes({MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON})
    public void edit(@PathParam("id") Integer id, Reviews entity) {
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
    public Reviews find(@PathParam("id") Integer id) {
        return super.find(id);
    }

    @GET
    @Override
    @Produces({MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON})
    public List<Reviews> findAll() {
        return super.findAll();
    }

    @GET
    @Path("{from}/{to}")
    @Produces({MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON})
    public List<Reviews> findRange(@PathParam("from") Integer from, @PathParam("to") Integer to) {
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