import { NextResponse } from 'next/server';

// 1. get all persons   /api/persons-page-x.json (yes we will be fetching all 266k persons)
// 2. only get persons of region VN, each should have info about rankings for each events

// https://www.worldcubeassociation.org/api/v0/persons?search=&order=asc&offset=0&limit=10&region=Vietnam

export async function POST(request) {
    const body = await request.json();
    const { events, type } = body;

    
}