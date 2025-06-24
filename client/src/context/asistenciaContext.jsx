import React, { createContext, useState, useContext } from 'react';
import {
  confirmAttendanceRequest,
  cancelAttendanceRequest,
  getAttendanceRequest,
  updateAttendanceRequest,
  deleteAttendanceRequest,
  getUserAttendancesRequest
} from '../api/attendanceApi';
 

export const AsistenciaContext = createContext();

export const AsistenciaProvider = ({ children }) => {
  const [attendees, setAttendees] = useState([]);
  const [error, setError] = useState(null);      
  const [forbidden, setForbidden] = useState(false); 
  const [userAttendances, setUserAttendances] = useState([]);
  const [loadingAttendances, setLoadingAttendances] = useState(false);

 const loadUserAttendances = async () => {
    setLoadingAttendances(true);
    try {
      const res = await getUserAttendancesRequest();
      setUserAttendances(res.data);
    } catch (error) {
      console.error("Error al cargar asistencias del usuario:", error);
    } finally {
      setLoadingAttendances(false);
    }
  };


  // 🔄 Cargar asistentes de una tarea
const fetchAttendees = async (taskId) => {
  try {
    const res = await getAttendanceRequest(taskId);
    setAttendees(res.data);
  } catch (error) {
    console.error("Error al obtener asistentes:", error);
  }
};


  // ✅ Confirmar asistencia
const confirmAttendance = async (data) => {


  setError(null);
  setForbidden(false);
  
  try {
    // Validación básica
    if (!data?.taskId || !data?.email || !data?.name) {
      throw new Error("Datos incompletos para confirmar asistencia");
    }

    console.log("Enviando a backend:", data); 

    const response = await confirmAttendanceRequest(data);
    
 
    const normalizedData = {
      ...response.data.attendance, 
      taskId: response.data.attendance.task, 
      email: response.data.attendance.email.toLowerCase()
    };

    // Actualiza el estado global
    setAttendees(prev => [
      ...prev.filter(a => 
        !(a.task === normalizedData.task && a.email === normalizedData.email)
      ),
      normalizedData
    ]);

    return normalizedData;
  } catch (error) {
    console.error("Error en confirmAttendance:", {
      inputData: data,
      error: error.response?.data || error.message
    });
    throw error;
  }
};  




const cancelAttendance = async ({ taskId, email }) => {
  setError(null);
  setForbidden(false);
  
  try {
    const lowerEmail = email.trim().toLowerCase();
    
    
    await cancelAttendanceRequest({ taskId, email: lowerEmail });
    
    setAttendees(prev => 
      prev.filter(a => !(a.task === taskId && a.email === lowerEmail))
    );
    
    return true; // Éxito
  } catch (err) {
    console.error("Error en cancelAttendance:", {
      taskId,
      email,
      error: err.response?.data || err.message
    });
    
    if (err.response?.status === 403) {
      setForbidden(true);
      toast.error('No tienes permiso para esta acción');
    } else {
      setError(err.response?.data?.message || 'Error al cancelar asistencia');
      toast.error(err.response?.data?.message || 'Error al cancelar asistencia');
    }
    throw err;
  }
};


  
const updateAttendance = async (id, updatedData) => {
  setError(null);
  setForbidden(false);
  try {
    const response = await updateAttendanceRequest(id, updatedData);
 
    setAttendees(prev =>
      prev.map(a => a._id === id ? { ...a, ...response.data.updated } : a)
    );
    return response.data.updated; // Devuelve el asistente actualizado
  } catch (err) {
    if (err.response?.status === 403) {
      setForbidden(true);
    } else {
      setError('Error al actualizar asistencia');
    }
    console.error(err);
    throw err;
  }
};


  //  Eliminar asistencia
  const deleteAttendance = async (id) => {
    setError(null);
    setForbidden(false);
    try {
      await deleteAttendanceRequest(id);
      setAttendees(prev => prev.filter(a => a._id !== id));
    } catch (err) {
      if (err.response?.status === 403) {
        setForbidden(true);
      } else {
        setError('Error al eliminar asistencia');
      }
      console.error(err);
    }
  };


  const createAttendee = async (data) => {
  setError(null);
  setForbidden(false);
  try {
    const response = await confirmAttendanceRequest({
      taskId: data.task,
      name: data.name,
      email: data.email
    });
    
    setAttendees(prev => [...prev, response.data.attendance]);
    return response.data.attendance;
  } catch (error) {
    console.error("Error creating attendee:", error);
    throw error;
  }
};

  

  const checkUserAttendance = (taskId) => {
  const userEmail = localStorage.getItem("userEmail")?.trim().toLowerCase();
  if (!userEmail) return false;
  

  const localAttendances = JSON.parse(localStorage.getItem(`userAttendances_${userEmail}`) || []);
  if (localAttendances.includes(taskId)) return true;
  

  return attendees.some(
    a => a.task === taskId && a.email === userEmail
  );
};

  return (
    <AsistenciaContext.Provider
      value={{
        attendees,
        error,
        forbidden,
        userAttendances,
        loadingAttendances,
        loadUserAttendances,
        checkUserAttendance, 
        fetchAttendees,
        confirmAttendance,
        cancelAttendance,
        updateAttendance,
        deleteAttendance,
        createAttendee,
      }}
    >
      {children}
    </AsistenciaContext.Provider>
  );
};

// 📦 Custom hook
export function useAsistencia() {
  const context = useContext(AsistenciaContext);
  if (!context) {
    throw new Error("useAsistencia debe usarse dentro de un AsistenciaProvider");
  }
  return context;
}