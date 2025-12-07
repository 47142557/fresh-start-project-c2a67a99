import React from "react";
import { HealthPlan } from "@/core/interfaces/plan/planes";
import { Clinica } from "@/core/interfaces/plan/clinicas";

interface PdfComparisonTemplateProps {
  plans: HealthPlan[];
  selectedRegions: string[];
  selectedBarrios: string[];
  editedPrices: Record<string, number>;
  groupedAttributes: Record<string, string[]>;
}

/**
 * Componente para generar el HTML del PDF de comparación.
 * Este componente contiene todos los estilos inline para Puppeteer.
 */
export const PdfComparisonTemplate: React.FC<PdfComparisonTemplateProps> = ({
  plans,
  selectedRegions,
  selectedBarrios,
  editedPrices,
  groupedAttributes,
}) => {
  // Filtrar clínicas por regiones y barrios seleccionados
  const getFilteredClinicas = (): Clinica[] => {
    const clinicaMap = new Map<string, Clinica>();
    plans.forEach((plan) => {
      plan.clinicas?.forEach((clinica) => {
        if (!clinicaMap.has(clinica.item_id)) {
          clinicaMap.set(clinica.item_id, clinica);
        }
      });
    });

    return Array.from(clinicaMap.values()).filter((clinica) => {
      if (selectedRegions.length === 0 && selectedBarrios.length === 0) {
        return true;
      }
      return clinica.ubicacion?.some((ub) => {
        const matchRegion =
          selectedRegions.length === 0 || selectedRegions.includes(ub.region || "");
        const matchBarrio =
          selectedBarrios.length === 0 || selectedBarrios.includes(ub.barrio || "");
        return matchRegion && matchBarrio;
      });
    });
  };

  const filteredClinicas = getFilteredClinicas();

  const getPlanAttributeValue = (plan: HealthPlan, attrName: string): string => {
    const attr = plan.attributes?.find((a) => a.name === attrName);
    return attr ? attr.value_name : "N/A";
  };

  const planIncludesClinica = (plan: HealthPlan, clinicaId: string): boolean => {
    return plan.clinicas?.some((clinica) => clinica.item_id === clinicaId) ?? false;
  };

  const getPrice = (plan: HealthPlan): number => {
    return editedPrices[plan._id] ?? plan.precio;
  };

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        fontSize: "10px",
        lineHeight: "1.4",
        color: "#1a1a1a",
        padding: "20px",
        maxWidth: "1200px",
        margin: "0 auto",
      }}
    >
      {/* Header */}
      <div
        style={{
          textAlign: "center",
          marginBottom: "24px",
          paddingBottom: "16px",
          borderBottom: "2px solid #0C8CE9",
        }}
      >
        <h1
          style={{
            fontSize: "18px",
            fontWeight: "bold",
            color: "#0C8CE9",
            margin: "0 0 8px 0",
          }}
        >
          Comparación de Planes de Salud
        </h1>
        <p style={{ color: "#666", margin: 0 }}>
          Generado el {new Date().toLocaleDateString("es-AR")}
        </p>
      </div>

      {/* Resumen de planes */}
      <div style={{ marginBottom: "24px" }}>
        <h2
          style={{
            fontSize: "14px",
            fontWeight: "bold",
            marginBottom: "12px",
            color: "#333",
          }}
        >
          Resumen de Planes
        </h2>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: "10px",
          }}
        >
          <thead>
            <tr style={{ backgroundColor: "#0C8CE9", color: "white" }}>
              <th style={{ padding: "8px", textAlign: "left", border: "1px solid #ddd" }}>
                Plan
              </th>
              <th style={{ padding: "8px", textAlign: "left", border: "1px solid #ddd" }}>
                Empresa
              </th>
              <th style={{ padding: "8px", textAlign: "right", border: "1px solid #ddd" }}>
                Precio Mensual
              </th>
              <th style={{ padding: "8px", textAlign: "center", border: "1px solid #ddd" }}>
                Rating
              </th>
            </tr>
          </thead>
          <tbody>
            {plans.map((plan, idx) => (
              <tr
                key={plan._id}
                style={{ backgroundColor: idx % 2 === 0 ? "#f9f9f9" : "white" }}
              >
                <td
                  style={{
                    padding: "8px",
                    border: "1px solid #ddd",
                    fontWeight: "500",
                  }}
                >
                  {plan.name}
                </td>
                <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                  {plan.empresa}
                </td>
                <td
                  style={{
                    padding: "8px",
                    border: "1px solid #ddd",
                    textAlign: "right",
                    fontWeight: "bold",
                    color: "#2DB87B",
                  }}
                >
                  ${getPrice(plan).toLocaleString("es-AR")}
                </td>
                <td
                  style={{
                    padding: "8px",
                    border: "1px solid #ddd",
                    textAlign: "center",
                  }}
                >
                  ⭐ {plan.rating}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Tabla de Beneficios */}
      <div style={{ marginBottom: "24px" }}>
        <h2
          style={{
            fontSize: "14px",
            fontWeight: "bold",
            marginBottom: "12px",
            color: "#333",
          }}
        >
          Comparación de Beneficios
        </h2>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: "9px",
          }}
        >
          <thead>
            <tr style={{ backgroundColor: "#0C8CE9", color: "white" }}>
              <th
                style={{
                  padding: "6px",
                  textAlign: "left",
                  border: "1px solid #ddd",
                  width: "180px",
                }}
              >
                Beneficio
              </th>
              {plans.map((plan) => (
                <th
                  key={plan._id}
                  style={{
                    padding: "6px",
                    textAlign: "center",
                    border: "1px solid #ddd",
                  }}
                >
                  {plan.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Object.entries(groupedAttributes).map(([groupName, attrNames]) => (
              <React.Fragment key={groupName}>
                {/* Group header */}
                <tr style={{ backgroundColor: "#e8f4fd" }}>
                  <td
                    colSpan={plans.length + 1}
                    style={{
                      padding: "8px 6px",
                      fontWeight: "bold",
                      fontSize: "10px",
                      color: "#0C8CE9",
                      border: "1px solid #ddd",
                    }}
                  >
                    {groupName}
                  </td>
                </tr>
                {/* Attributes */}
                {attrNames.map((attrName, idx) => (
                  <tr
                    key={attrName}
                    style={{ backgroundColor: idx % 2 === 0 ? "#fafafa" : "white" }}
                  >
                    <td
                      style={{
                        padding: "4px 6px",
                        border: "1px solid #ddd",
                        fontWeight: "500",
                      }}
                    >
                      {attrName}
                    </td>
                    {plans.map((plan) => {
                      const value = getPlanAttributeValue(plan, attrName);
                      return (
                        <td
                          key={`${plan._id}-${attrName}`}
                          style={{
                            padding: "4px 6px",
                            textAlign: "center",
                            border: "1px solid #ddd",
                            color: value === "N/A" || value === "No" ? "#999" : "#333",
                          }}
                        >
                          {value}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* Tabla de Clínicas */}
      {filteredClinicas.length > 0 && (
        <div style={{ marginBottom: "24px" }}>
          <h2
            style={{
              fontSize: "14px",
              fontWeight: "bold",
              marginBottom: "8px",
              color: "#333",
            }}
          >
            Cartilla Médica
          </h2>
          {(selectedRegions.length > 0 || selectedBarrios.length > 0) && (
            <p style={{ fontSize: "9px", color: "#666", marginBottom: "8px" }}>
              Filtrado por:{" "}
              {selectedRegions.length > 0 && `Regiones: ${selectedRegions.join(", ")}`}
              {selectedRegions.length > 0 && selectedBarrios.length > 0 && " | "}
              {selectedBarrios.length > 0 && `Barrios: ${selectedBarrios.join(", ")}`}
            </p>
          )}
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "9px",
            }}
          >
            <thead>
              <tr style={{ backgroundColor: "#0C8CE9", color: "white" }}>
                <th
                  style={{
                    padding: "6px",
                    textAlign: "left",
                    border: "1px solid #ddd",
                  }}
                >
                  Clínica / Centro Médico
                </th>
                {plans.map((plan) => (
                  <th
                    key={plan._id}
                    style={{
                      padding: "6px",
                      textAlign: "center",
                      border: "1px solid #ddd",
                    }}
                  >
                    {plan.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredClinicas.slice(0, 50).map((clinica, idx) => (
                <tr
                  key={clinica.item_id}
                  style={{ backgroundColor: idx % 2 === 0 ? "#fafafa" : "white" }}
                >
                  <td style={{ padding: "4px 6px", border: "1px solid #ddd" }}>
                    <div style={{ fontWeight: "500" }}>{clinica.entity}</div>
                    {clinica.ubicacion?.[0] && (
                      <div style={{ fontSize: "8px", color: "#666" }}>
                        {clinica.ubicacion[0].barrio} - {clinica.ubicacion[0].region}
                      </div>
                    )}
                  </td>
                  {plans.map((plan) => (
                    <td
                      key={`${plan._id}-${clinica.item_id}`}
                      style={{
                        padding: "4px 6px",
                        textAlign: "center",
                        border: "1px solid #ddd",
                        color: planIncludesClinica(plan, clinica.item_id)
                          ? "#2DB87B"
                          : "#dc3545",
                        fontWeight: "bold",
                      }}
                    >
                      {planIncludesClinica(plan, clinica.item_id) ? "✓" : "✗"}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          {filteredClinicas.length > 50 && (
            <p style={{ fontSize: "9px", color: "#666", marginTop: "8px" }}>
              Mostrando 50 de {filteredClinicas.length} clínicas
            </p>
          )}
        </div>
      )}

      {/* Footer */}
      <div
        style={{
          textAlign: "center",
          paddingTop: "16px",
          borderTop: "1px solid #ddd",
          color: "#666",
          fontSize: "9px",
        }}
      >
        <p style={{ margin: 0 }}>
          Este documento es informativo. Los precios y coberturas pueden variar.
        </p>
        <p style={{ margin: "4px 0 0 0" }}>Consulte con un asesor para información actualizada.</p>
      </div>
    </div>
  );
};

/**
 * Genera el HTML completo del PDF como string
 */
export const generatePdfHtml = (props: PdfComparisonTemplateProps): string => {
  // Usamos ReactDOMServer en runtime si está disponible
  // Para SPA, construimos el HTML manualmente
  const { plans, selectedRegions, selectedBarrios, editedPrices, groupedAttributes } = props;

  // Helper functions
  const getFilteredClinicas = (): any[] => {
    const clinicaMap = new Map<string, any>();
    plans.forEach((plan) => {
      plan.clinicas?.forEach((clinica) => {
        if (!clinicaMap.has(clinica.item_id)) {
          clinicaMap.set(clinica.item_id, clinica);
        }
      });
    });

    return Array.from(clinicaMap.values()).filter((clinica) => {
      if (selectedRegions.length === 0 && selectedBarrios.length === 0) {
        return true;
      }
      return clinica.ubicacion?.some((ub: any) => {
        const matchRegion =
          selectedRegions.length === 0 || selectedRegions.includes(ub.region || "");
        const matchBarrio =
          selectedBarrios.length === 0 || selectedBarrios.includes(ub.barrio || "");
        return matchRegion && matchBarrio;
      });
    });
  };

  const getPlanAttributeValue = (plan: HealthPlan, attrName: string): string => {
    const attr = plan.attributes?.find((a) => a.name === attrName);
    return attr ? attr.value_name : "N/A";
  };

  const planIncludesClinica = (plan: HealthPlan, clinicaId: string): boolean => {
    return plan.clinicas?.some((clinica) => clinica.item_id === clinicaId) ?? false;
  };

  const getPrice = (plan: HealthPlan): number => {
    return editedPrices[plan._id] ?? plan.precio;
  };

  const filteredClinicas = getFilteredClinicas();

  // Build HTML string
  let html = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Comparación de Planes de Salud</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: Arial, sans-serif; font-size: 10px; line-height: 1.4; color: #1a1a1a; padding: 20px; }
    .container { max-width: 1200px; margin: 0 auto; }
    .header { text-align: center; margin-bottom: 24px; padding-bottom: 16px; border-bottom: 2px solid #0C8CE9; }
    .header h1 { font-size: 18px; font-weight: bold; color: #0C8CE9; margin-bottom: 8px; }
    .header p { color: #666; }
    .section { margin-bottom: 24px; }
    .section h2 { font-size: 14px; font-weight: bold; margin-bottom: 12px; color: #333; }
    table { width: 100%; border-collapse: collapse; font-size: 9px; }
    th, td { padding: 6px; border: 1px solid #ddd; }
    th { background-color: #0C8CE9; color: white; }
    .group-header { background-color: #e8f4fd !important; }
    .group-header td { font-weight: bold; font-size: 10px; color: #0C8CE9; padding: 8px 6px; }
    .even-row { background-color: #fafafa; }
    .odd-row { background-color: white; }
    .price { font-weight: bold; color: #2DB87B; }
    .check { color: #2DB87B; font-weight: bold; }
    .cross { color: #dc3545; font-weight: bold; }
    .na { color: #999; }
    .footer { text-align: center; padding-top: 16px; border-top: 1px solid #ddd; color: #666; font-size: 9px; }
  </style>
</head>
<body>
<div class="container">
  <div class="header">
    <h1>Comparación de Planes de Salud</h1>
    <p>Generado el ${new Date().toLocaleDateString("es-AR")}</p>
  </div>

  <div class="section">
    <h2>Resumen de Planes</h2>
    <table>
      <thead>
        <tr>
          <th style="text-align:left;">Plan</th>
          <th style="text-align:left;">Empresa</th>
          <th style="text-align:right;">Precio Mensual</th>
          <th style="text-align:center;">Rating</th>
        </tr>
      </thead>
      <tbody>
        ${plans
          .map(
            (plan, idx) => `
          <tr class="${idx % 2 === 0 ? "even-row" : "odd-row"}">
            <td style="font-weight:500;">${plan.name}</td>
            <td>${plan.empresa}</td>
            <td style="text-align:right;" class="price">$${getPrice(plan).toLocaleString("es-AR")}</td>
            <td style="text-align:center;">⭐ ${plan.rating}</td>
          </tr>
        `
          )
          .join("")}
      </tbody>
    </table>
  </div>

  <div class="section">
    <h2>Comparación de Beneficios</h2>
    <table>
      <thead>
        <tr>
          <th style="text-align:left;width:180px;">Beneficio</th>
          ${plans.map((plan) => `<th style="text-align:center;">${plan.name}</th>`).join("")}
        </tr>
      </thead>
      <tbody>
        ${Object.entries(groupedAttributes)
          .map(
            ([groupName, attrNames]) => `
          <tr class="group-header">
            <td colspan="${plans.length + 1}">${groupName}</td>
          </tr>
          ${attrNames
            .map((attrName, idx) => {
              return `
              <tr class="${idx % 2 === 0 ? "even-row" : "odd-row"}">
                <td style="font-weight:500;">${attrName}</td>
                ${plans
                  .map((plan) => {
                    const value = getPlanAttributeValue(plan, attrName);
                    const cssClass = value === "N/A" || value === "No" ? "na" : "";
                    return `<td style="text-align:center;" class="${cssClass}">${value}</td>`;
                  })
                  .join("")}
              </tr>
            `;
            })
            .join("")}
        `
          )
          .join("")}
      </tbody>
    </table>
  </div>

  ${
    filteredClinicas.length > 0
      ? `
  <div class="section">
    <h2>Cartilla Médica</h2>
    ${
      selectedRegions.length > 0 || selectedBarrios.length > 0
        ? `<p style="font-size:9px;color:#666;margin-bottom:8px;">
        Filtrado por: ${selectedRegions.length > 0 ? `Regiones: ${selectedRegions.join(", ")}` : ""}
        ${selectedRegions.length > 0 && selectedBarrios.length > 0 ? " | " : ""}
        ${selectedBarrios.length > 0 ? `Barrios: ${selectedBarrios.join(", ")}` : ""}
      </p>`
        : ""
    }
    <table>
      <thead>
        <tr>
          <th style="text-align:left;">Clínica / Centro Médico</th>
          ${plans.map((plan) => `<th style="text-align:center;">${plan.name}</th>`).join("")}
        </tr>
      </thead>
      <tbody>
        ${filteredClinicas
          .slice(0, 50)
          .map(
            (clinica, idx) => `
          <tr class="${idx % 2 === 0 ? "even-row" : "odd-row"}">
            <td>
              <div style="font-weight:500;">${clinica.entity}</div>
              ${
                clinica.ubicacion?.[0]
                  ? `<div style="font-size:8px;color:#666;">${clinica.ubicacion[0].barrio} - ${clinica.ubicacion[0].region}</div>`
                  : ""
              }
            </td>
            ${plans
              .map((plan) =>
                planIncludesClinica(plan, clinica.item_id)
                  ? `<td style="text-align:center;" class="check">✓</td>`
                  : `<td style="text-align:center;" class="cross">✗</td>`
              )
              .join("")}
          </tr>
        `
          )
          .join("")}
      </tbody>
    </table>
    ${
      filteredClinicas.length > 50
        ? `<p style="font-size:9px;color:#666;margin-top:8px;">Mostrando 50 de ${filteredClinicas.length} clínicas</p>`
        : ""
    }
  </div>
  `
      : ""
  }

  <div class="footer">
    <p>Este documento es informativo. Los precios y coberturas pueden variar.</p>
    <p style="margin-top:4px;">Consulte con un asesor para información actualizada.</p>
  </div>
</div>
</body>
</html>
  `;

  return html;
};
