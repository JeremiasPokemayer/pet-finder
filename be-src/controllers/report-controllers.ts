import mapboxgl from "mapbox-gl";
import { client } from "../lib/algolia";
import { cloudinary } from "../lib/cloudinary";
import { Resend } from "resend";
import { Pet } from "../models/pet";
import { Report } from "../models/report";

mapboxgl.accessToken = process.env.MAP_BOX_TOKEN;

const resend = new Resend(process.env.RESEND_API_KEY);

export async function setReport(dataReport, id) {
  const indexName = "mascotas";
  const { reportName, reportPhone, location, reportEmail } = dataReport;
  const pet = await Pet.findOne({
    where: {
      id,
    },
  });

  const { data, error } = await resend.emails.send({
    from: "Jeremias <report@resend.dev>",
    to: [reportEmail],
    subject: `Vieron a tu mascota ${pet.get("name")} `,
    html: `<strong>La vio ${reportName}</strong><br><strong>Ubicación:</strong> ${location}<br><strong>Teléfono:</strong> ${reportPhone}`,
  });

  if (error) {
    console.error("Error al enviar el correo:", error);
    throw new Error("No se pudo enviar el correo de reporte.");
  }

  const report = await Report.create({
    petId: pet.get("id"),
    reportName: reportName,
    reportPhone: reportPhone,
    location: location,
  });

  return report;
}
