import CrearActivoForm from '@/components/CrearActivoForm';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-extrabold text-blue-900">?? Mi Testamento Digital</h1>
        <p className="text-gray-600 mt-2">Gestiona tu legado de forma segura</p>
      </div>
      
      <CrearActivoForm />
    </main>
  );
}
