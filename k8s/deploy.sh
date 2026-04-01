#!/bin/bash
set -e

echo "=========================================="
echo "Deploying docs to k3s"
echo "=========================================="

cd "$(dirname "$0")"

# Check if k3s is running
if ! kubectl cluster-info &> /dev/null; then
    echo "Error: k3s is not running or kubectl not configured"
    echo "Run: export KUBECONFIG=/etc/rancher/k3s/k3s.yaml"
    exit 1
fi

echo ""
echo "[2/4] Applying Kubernetes manifests (Deployment + Service + HPA)..."
kubectl apply -f deployment.yaml

# echo ""
# echo "[3/4] Creating/updating ConfigMap from ../.env..."
# kubectl create configmap docs-config \
#     --from-env-file=../../.env \
#     -n goclaw \
#     --dry-run=client -o yaml | kubectl apply -f -
# echo "ConfigMap created."

echo ""
echo "[4/4] Waiting for docs deployment..."
kubectl rollout status deployment/docs -n goclaw --timeout=300s

echo ""
echo "=========================================="
echo "Deployment ready!"
echo "=========================================="

kubectl get pods -n goclaw -o wide
echo ""
kubectl get hpa -n goclaw

NODE_IP=$(hostname -I | awk '{print $1}')
