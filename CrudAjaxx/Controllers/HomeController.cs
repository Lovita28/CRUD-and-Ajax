using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Data.Entity.Validation;
using System.Data.Entity.Infrastructure;
using CrudAjaxx.Models;

namespace CrudAjaxx.Controllers
{
    public class HomeController : Controller
    {
        private ContosoUniversity2Entities con = new ContosoUniversity2Entities();

        public ActionResult Index()
        {
            return View();
        }

        public JsonResult List()
        {
            var hasil = from pres in con.Person where pres.Discriminator == "Student" select pres;

            return new JsonResult() { Data = hasil, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
        }

        public JsonResult Add(Person pers)
        {
                con.Person.Add(pers);
                con.SaveChanges();
            return Json(pers, JsonRequestBehavior.AllowGet);
        }

        public JsonResult Update(Person pers)
        {
            con.Person.Add(pers);
            con.Entry(pers).State = System.Data.Entity.EntityState.Modified;
                con.SaveChanges();
            
            return Json(pers, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetbyID(int ID)
        {
            Person Persons = con.Person.Find(ID);
            return Json(Persons, JsonRequestBehavior.AllowGet);
        }

        public JsonResult Delete(int ID)
        {
            Person person = con.Person.Find(ID);
            con.Person.Remove(person);
             con.SaveChanges();
            
            return Json(person, JsonRequestBehavior.AllowGet);
        }
    }
}