<?php

namespace App\Http\Controllers;

use App\Http\Resources\ProjectResource;
use App\Models\Project;
use Illuminate\Http\Request;

class ProjectController extends Controller
{
    public function index(Request $request)
    {
        $projects = $request->user()
            ->projects()
            ->with('user')
            ->withCount('tasks')
            ->get();

        return ProjectResource::collection($projects);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => ['required', 'string'],
            'description' => ['nullable', 'string'],
        ]);

        $project = $request->user()
            ->projects()
            ->create($data);

        return (new ProjectResource($project))
            ->response()
            ->setStatusCode(201);
    }

    public function show(Project $project)
{
    abort_unless($project->user_id === request()->user()->id, 403);

    return new ProjectResource(
        $project->load('user', 'tasks')
    );
}

    public function update(Request $request, Project $project)
    {
        abort_unless(
            $project->user()->is($request->user()),
            403
        );

        $data = $request->validate([
            'name' => ['sometimes', 'required', 'string'],
            'description' => ['nullable', 'string'],
        ]);

        $project->update($data);

        $project->load('user', 'tasks');
        $project->loadCount('tasks');

        return new ProjectResource($project);
    }

    public function destroy(Request $request, Project $project)
    {
        abort_unless(
            $project->user()->is($request->user()),
            403
        );

        $project->delete();

        return response()->noContent();
    }
}