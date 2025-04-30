import { useState } from "react";
import { useTasks } from "../../context/tasksContext";
import { Button, ButtonLink, Card } from "../ui";

export function TaskCard({ task }) {
  const { deleteTask } = useTasks();
  const [showModal, setShowModal] = useState(false);

  const handleDelete = () => {
    deleteTask(task._id);
    setShowModal(false);
  };

  return (
    <>
      <Card>
        <header className="flex justify-between">
          <h1 className="text-2xl font-bold">{task.title}</h1>
          <div className="flex gap-x-2 items-center">
            <Button onClick={() => setShowModal(true)}>Eliminar</Button>
            <ButtonLink to={`/tasks/${task._id}`}>Editar</ButtonLink>
          </div>
        </header>
        <p className="text-slate-300">{task.description}</p>

        {task.place && (
          <p className="mt-2">
            <span className="font-semibold">Lugar de la Actividad:</span>{" "}
            {task.place}
          </p>
        )}

        {task.responsible && task.responsible.length > 0 && (
          <p className="mt-1">
            <span className="font-semibold">Responsables de la Actividad:</span>{" "}
            {task.responsible.join(", ")}
          </p>
        )}

        <p>
          {task.date &&
            new Date(task.date).toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
        </p>
      </Card>

      {/* Modal de confirmación */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl">
            <h2 className="text-xl font-bold mb-4 text-center text-gray-800">
              ¿Estás seguro que quieres eliminar esta actividad?
            </h2>
            
            <p className="mb-6 text-gray-600 text-center">
              Si elimina esta actividad se borrarán todos los archivos asociados permanentemente
            </p>
            
            <div className="border-t border-gray-200 my-4"></div>
            
            <div className="flex justify-center gap-4">
              <button
                className="px-6 py-2 text-gray-700 font-medium hover:bg-gray-100 rounded"
                onClick={() => setShowModal(false)}
              >
                Cancelar
              </button>
              <button
                className="px-6 py-2 bg-red-600 text-white font-medium hover:bg-red-700 rounded"
                onClick={handleDelete}
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}