'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Star } from 'lucide-react';

import { useDailyPass } from '@/contexts/DailyPassContext';

export default function FeedbackPage() {
  const { addFeedback } = useDailyPass();
  const [rating, setRating] = useState(0);
  const [name, setName] = useState('');
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      alert('Por favor seleccione una calificación.');
      return;
    }
    
    addFeedback({
        name: name || 'Anónimo',
        rating,
        comment
    });
    
    setTimeout(() => {
        setSubmitted(true);
    }, 500);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center py-10">
          <CardContent className="space-y-4">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
               <Star className="w-8 h-8 text-green-600 fill-green-600" />
            </div>
            <CardTitle className="text-2xl text-green-700">¡Gracias por tu opinión!</CardTitle>
            <CardDescription className="text-lg">
              Tus comentarios nos ayudan a mejorar cada día.
            </CardDescription>
            <Button onClick={() => window.location.reload()} variant="outline" className="mt-6">
              Enviar otra respuesta
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="mb-8 text-center">
            {/* Logo placeholder */}
            <h1 className="text-3xl font-bold text-slate-800">Las Gaviotas & Fontana</h1>
            <p className="text-slate-500">Encuesta de Satisfacción</p>
        </div>

      <Card className="max-w-lg w-full shadow-lg">
        <CardHeader>
          <CardTitle>¿Cómo estuvo tu visita?</CardTitle>
          <CardDescription>
            Déjanos saber tu opinión para seguir mejorando nuestros servicios.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div className="space-y-2 text-center">
                <Label className="text-base">Calificación General</Label>
                <div className="flex justify-center gap-2 mt-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            className="focus:outline-none transition-transform hover:scale-110"
                        >
                            <Star 
                                className={`w-10 h-10 ${star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-slate-200'}`} 
                            />
                        </button>
                    ))}
                </div>
                <p className="text-sm text-slate-400 h-4">
                    {rating === 1 && "Muy Malo"}
                    {rating === 2 && "Malo"}
                    {rating === 3 && "Regular"}
                    {rating === 4 && "Bueno"}
                    {rating === 5 && "Excelente"}
                </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Nombre (Opcional)</Label>
              <Input
                id="name"
                placeholder="Tu nombre"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="comment">Comentarios o Sugerencias</Label>
              <Textarea
                id="comment"
                placeholder="¿Qué te gustó más? ¿Qué podemos mejorar?"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="min-h-[100px]"
              />
            </div>

            <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-lg py-6">
              Enviar Opinión
            </Button>
          </form>
        </CardContent>
      </Card>
      
      <div className="mt-8 text-xs text-slate-400">
         &copy; {new Date().getFullYear()} Las Gaviotas & Fontana - Todos los derechos reservados.
      </div>
    </div>
  );
}
