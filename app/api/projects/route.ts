import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Project from '@/models/Project';
import { authenticateRequest } from '@/lib/auth';

// GET - Récupérer tous les projets
export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    const projects = await Project.find().sort({ order: 1, createdAt: -1 });
    
    return NextResponse.json(projects);
  } catch (error) {
    console.error('Get projects error:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

// POST - Créer un nouveau projet
export async function POST(request: NextRequest) {
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
    
    const project = new Project(body);
    await project.save();
    
    return NextResponse.json(project, { status: 201 });
  } catch (error: any) {
    console.error('Create project error:', error);
    
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
