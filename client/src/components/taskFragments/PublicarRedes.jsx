import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { generarEnlaceCompartir } from "../../api/tasks";
import { useTasks } from "../../context/tasksContext";
import { FiShare2, FiTwitter, FiFacebook, FiInstagram, FiLink } from "react-icons/fi";

export function PublicarRedes() {
  const { id } = useParams();
  const { tasks } = useTasks();
  const [descripcion, setDescripcion] = useState("");
  const [redSocial, setRedSocial] = useState("facebook");
  const [enlace, setEnlace] = useState("");
  const [loading, setLoading] = useState(true);

  const task = tasks.find(t => t._id === id);

  useEffect(() => {
    const generarEnlace = async () => {
      try {
        const response = await generarEnlaceCompartir(id, {
          socialNetwork: redSocial,
          description: descripcion
        });
        setEnlace(response.data.shareUrl);
      } catch (error) {
        console.error("Error generando enlace:", error);
      } finally {
        setLoading(false);
      }
    };
    generarEnlace();
  }, [id, redSocial, descripcion]);

  const handlePublicar = () => {
    window.open(enlace, "_blank");
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(enlace);
  };

  return (
    <div className="max-w-4xl mx-auto p-3 bg-white rounded-xl shadow-lg">
      <div className="mb-5 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
          <FiShare2 className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          {task?.title}
        </h2>
        <p className="text-gray-500">Genera un enlace único para compartir esta actividad</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Descripción 
          </label>
          <div className="relative">
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              maxLength="250"
              className="w-full h-18 px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-black "
              placeholder="Ej: ¡Únete a esta increíble actividad comunitaria!"
            />
            <span className="absolute bottom-2 right-2 text-xs text-black">
              {descripcion.length}/250
            </span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Selecciona red social
          </label>
          <div className="grid grid-cols-3 gap-4">
            {[
              { name: "facebook", icon: <FiFacebook /> },
              { name: "twitter", icon: <FiTwitter /> },
              { name: "instagram", icon: <FiInstagram /> }
            ].map((red) => (
              <button
                key={red.name}
                onClick={() => setRedSocial(red.name)}
                className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center
                  ${redSocial === red.name 
                    ? "border-green-500 bg-green-50" 
                    : "border-gray-200 hover:border-green-300"}`}
              >
                <span className="text-2xl mb-2 text-gray-700">
                  {red.icon}
                </span>
                <span className="text-sm font-medium capitalize">
                  {red.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Enlace generado
          </label>
          <div className="flex items-center gap-2">
          <div className="flex-1 p-3 bg-gray-50 rounded-lg border border-gray-200 text-gray-500 overflow-hidden">
  {loading ? (
    <div className="h-4 bg-gray-200 animate-pulse rounded w-3/4"></div>
  ) : (
    <span className="block truncate whitespace-nowrap">
      {enlace || <span className="text-red-500">Error al generar enlace</span>}
    </span>
  )}
</div>

            <button
              onClick={handleCopyLink}
              className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-gray-700 transition-colors"
              title="Copiar enlace"
            >
              <FiLink className="w-5 h-5" />
            </button>
          </div>
        </div>

        <button
          onClick={handlePublicar}
          disabled={!enlace || loading}
          className="w-full py-3 px-6 bg-gradient-to-r from-green-600 to-green-700 text-white font-medium rounded-lg
                   hover:from-green-700 hover:to-green-800 disabled:opacity-50 disabled:cursor-not-allowed
                   transition-all flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Generando...
            </>
          ) : (
            <>
              <FiShare2 className="w-5 h-5" />
              Publicar en {redSocial.charAt(0).toUpperCase() + redSocial.slice(1)}
            </>
          )}
        </button>
      </div>
    </div>
  );
}
