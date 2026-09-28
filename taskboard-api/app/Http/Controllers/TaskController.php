<?php

namespace App\Http\Controllers;

use App\Http\Resources\TaskResource;
use App\Models\Project;
use App\Models\Task;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    public function index(Request $request, Project $project)
    {
        abort_unless(
            $project->user()->is($request->user()),
            403
        );

        return TaskResource::collection($project->tasks);
    }

    public function store(Request $request, Project $project)
    {
            abort_unless($project->user()->is($request->user()), 403);

    $data = $request->validate([
        'title' => ['required', 'string'],
        'is_done' => ['sometimes', 'boolean'],
        'due_date' => ['nullable', 'date'],
    ]);

    $task = $project->tasks()->create($data);

    return new TaskResource($task->load('project'));
    }

    public function show(Request $request, Task $task)
    {
        abort_unless(
            $task->project->user()->is($request->user()),
            403
        );

        $task->load('project');

        return new TaskResource($task);
    }

    public function update(Request $request, Project $project, Task $task)
{
    abort_unless($project->user()->is($request->user()), 403);

    abort_unless($task->project_id === $project->id, 404);

    $data = $request->validate([
        'title' => ['sometimes', 'string'],
        'is_done' => ['sometimes', 'boolean'],
        'due_date' => ['nullable', 'date'],
    ]);

    $task->update($data);

    return new TaskResource($task->load('project'));
}

    public function destroy(Request $request, Task $task)
    {
        abort_unless(
            $task->project->user()->is($request->user()),
            403
        );

        $task->delete();

        return response()->noContent();
    }
}