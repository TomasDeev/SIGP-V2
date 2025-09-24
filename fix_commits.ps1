# Script para cambiar los mensajes de commit
$commits = @(
    @{hash="ae104c"; old="Fix email confirmation status"; new="Corregir estado de confirmación de email"},
    @{hash="f1caf19"; old="Fix build script and RLS"; new="Corregir script de build y RLS"},
    @{hash="94ef416"; old="Fix user email confirmation status"; new="Corregir estado de confirmación de email del usuario"},
    @{hash="52b1b47"; old="Fix email confirmation status"; new="Corregir estado de confirmación de email"},
    @{hash="b5f179f"; old="Fix RLS policies"; new="Corregir políticas RLS"},
    @{hash="d98f089"; old="Fix user display issue"; new="Corregir problema de visualización de usuario"},
    @{hash="a127eb1"; old="Fix user creation and email confirmation"; new="Corregir creación de usuario y confirmación de email"},
    @{hash="2c687a9"; old="Fix user creation trigger"; new="Corregir trigger de creación de usuario"},
    @{hash="e81ac8f"; old="Fix user creation and build error"; new="Corregir creación de usuario y error de build"},
    @{hash="0a4b900"; old="Fix: Allow user creation via form"; new="Corregir: Permitir creación de usuario via formulario"},
    @{hash="5aac916"; old="Fix user synchronization"; new="Corregir sincronización de usuario"}
)

foreach ($commit in $commits) {
    Write-Host "Modificando commit $($commit.hash)..."
    $newMessage = $commit.new -replace "gpt-engineer-app\[bot\]", "tomasdevs"
    git commit --amend --author="tomasdevs <tomasdevs@example.com>" --message="$newMessage" --no-edit
}