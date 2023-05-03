import { prisma } from "~/server/db";

const updateProperties = async (req, res) => {
  try {
    const properties = await prisma.property.findMany();

    properties.forEach(async (property) => {
      await fetch(`/cron/check_property?id=${property.id}`);
    });

    return res.status(200).send(JSON.stringify(updated));
  } catch (e) {
    return res.status(500);
  }
};

export default updateProperties;
