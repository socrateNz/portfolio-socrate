import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Project from '@/models/Project';
import { authenticateRequest } from '@/lib/auth';

// GET - Récupérer un projet spécifique
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    
    const project = await Project.findById((await params).id);
    
    if (!project) {
      return NextResponse.json(
        { error: 'Projet non trouvé' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(project);
  } catch (error) {
    console.error('Get project error:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

// PUT - Mettre à jour un projet
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Authentification
    const user = await authenticateRequest(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    await dbConnect();
    
    const body = await request.json();
    
    // Validation côté serveur
    if (!body.title || !body.description || !body.image) {
      return NextResponse.json(
        { error: 'Titre, description et image sont requis' },
        { status: 400 }
      );
    }
    
    const project = await Project.findByIdAndUpdate(
      (await params).id,
      body,
      { new: true, runValidators: true }
    );
    
    if (!project) {
      return NextResponse.json(
        { error: 'Projet non trouvé' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(project);
  } catch (error: any) {
    console.error('Update project error:', error);
    
    // Gestion spécifique des erreurs de validation MongoDB
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json(
        { error: 'Erreur de validation', details: validationErrors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer un projet
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Authentification
    const user = await authenticateRequest(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    await dbConnect();
    
    const project = await Project.findByIdAndDelete(params.id);
    
    if (!project) {
      return NextResponse.json(
        { error: 'Projet non trouvé' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ message: 'Projet supprimé avec succès' });
  } catch (error) {
    console.error('Delete project error:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
